// track-contents-course-automation の text-checker から移植したルール群の共通実装。
// 旧実装は生テキストの行スキャンだったが、textlint の AST ベースに書き直している。
//
// 旧 text-checker のオプションとの対応:
// - enabledInCodeBlock: CodeBlock ノードを検査対象に含めるか
// - enabledInCodeLine:  Code (インラインコード) ノードを検査対象に含めるか
// - excludeSections:    「## 名前」「### 名前」で始まるセクション配下を検査しない

import path = require("path");
import type {
  TextlintRuleContext,
  TextlintRuleModule,
  TextlintRuleReportHandler,
} from "@textlint/types";
import type { TxtNode } from "@textlint/ast-node-types";

// Html ノードは raw HTML を value に持つ (@textlint/ast-node-types の TxtNode には無いため補う)
type TxtNodeWithValue = TxtNode & { value?: string };

export interface TrackRuleOptions {
  description?: string;
  regexp?: string | string[];
  exclude?: string | string[] | null;
  enabledInCodeBlock?: boolean;
  enabledInCodeLine?: boolean;
  excludeSections?: string[];
  skipReadme?: boolean;
}

export interface DirectiveCommentRuleDefaults extends TrackRuleOptions {
  marker: string;
}

export interface DirectivePairRuleDefaults extends TrackRuleOptions {
  filterRegexp: RegExp;
  perRuleName: boolean;
}

const DEFAULT_OPTIONS = {
  description: "",
  enabledInCodeBlock: true,
  enabledInCodeLine: true,
  excludeSections: [] as string[],
};

function toArray(value: string | string[] | null | undefined): string[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function isReadme(context: TextlintRuleContext): boolean {
  const filePath = context.getFilePath();
  return Boolean(filePath) && path.basename(filePath as string) === "README.md";
}

// text-checker と同じセクション判定 (「## 名前」「### 名前」。「(」以降は名前に含めない)
const SECTION_RE = /^(###?) (.+?)(\(|$)/;

/**
 * 現在のセクション名を Header ノードで追跡する。
 * 返り値の handlers を visitor にマージして使う。
 */
function createSectionTracker(context: TextlintRuleContext) {
  const { Syntax, getSource } = context;
  let current: string | null = null;
  return {
    handlers: {
      [Syntax.Header](node: TxtNode) {
        const line = getSource(node).split("\n")[0];
        const matched = line.match(SECTION_RE);
        if (matched) {
          current = matched[2];
        }
      },
    },
    isExcluded(excludeSections: string[]): boolean {
      return current !== null && excludeSections.includes(current);
    },
  };
}

/**
 * exclude にマッチした範囲を同じ長さの空白に置き換える。
 * (元実装は削除していたが、位置を保ったマッチ報告のためにマスクにしている)
 */
function maskExcluded(text: string, excludes: RegExp[]): string {
  let masked = text;
  for (const e of excludes) {
    e.lastIndex = 0;
    masked = masked.replace(e, (m) => " ".repeat(m.length));
  }
  return masked;
}

/**
 * 正規表現ベースのルールを作る (text-checker の RegexpRule 相当)。
 * Str / Html (+ オプションにより CodeBlock / Code) ノードのテキストを検査し、
 * マッチ箇所を報告する。
 */
export function createPatternRule(
  defaults: TrackRuleOptions
): TextlintRuleModule<TrackRuleOptions> {
  return function rule(context, userOptions) {
    const options = Object.assign({}, DEFAULT_OPTIONS, defaults, userOptions || {});
    const { Syntax, RuleError, report, getSource, locator } = context;

    if (options.skipReadme && isReadme(context)) {
      return {} as TextlintRuleReportHandler;
    }

    const regexps = toArray(options.regexp).map((r) => new RegExp(r, "g"));
    const excludes = toArray(options.exclude).map((e) => new RegExp(e, "g"));
    const tracker = createSectionTracker(context);

    const check = (node: TxtNode) => {
      if (tracker.isExcluded(options.excludeSections)) {
        return;
      }
      const text = maskExcluded(getSource(node), excludes);
      const matches: Array<[number, number]> = [];
      for (const re of regexps) {
        re.lastIndex = 0;
        let matched;
        while ((matched = re.exec(text)) !== null) {
          matches.push([matched.index, matched.index + matched[0].length]);
          if (matched[0].length === 0) {
            re.lastIndex++; // 空文字マッチによる無限ループを防ぐ
          }
        }
      }
      // 複数の正規表現が同じ箇所にマッチした場合 (例: カンマの前後判定) は
      // 重複した報告を避けるため、範囲が重なるものは 1 件にまとめる
      matches.sort((a, b) => a[0] - b[0]);
      let lastEnd = -1;
      for (const [start, end] of matches) {
        if (start < lastEnd) {
          continue;
        }
        report(
          node,
          new RuleError(options.description, {
            padding: locator.range([start, end]),
          })
        );
        lastEnd = end;
      }
    };

    const visitors: Record<string, (node: TxtNode) => void> = Object.assign({}, tracker.handlers, {
      [Syntax.Str]: check,
      [Syntax.Html]: check,
    });
    if (options.enabledInCodeBlock) {
      visitors[Syntax.CodeBlock] = check;
    }
    if (options.enabledInCodeLine) {
      visitors[Syntax.Code] = check;
    }
    return visitors;
  };
}

/**
 * 言語指定のないコードブロックを検出するルールを作る
 * (text-checker の CodeBlockLanguageRule 相当)。
 * 元実装と同じく「``` のみの開始フェンス」だけを対象にする
 * (インデントコードブロックや ~~~ フェンスは対象外)。
 */
export function createCodeBlockLanguageRule(
  defaults: TrackRuleOptions
): TextlintRuleModule<TrackRuleOptions> {
  return function rule(context, userOptions) {
    const options = Object.assign({}, DEFAULT_OPTIONS, defaults, userOptions || {});
    const { Syntax, RuleError, report, getSource } = context;
    const fenceRe = new RegExp(toArray(options.regexp)[0]);
    const tracker = createSectionTracker(context);

    return Object.assign({}, tracker.handlers, {
      [Syntax.CodeBlock](node: TxtNode) {
        if (tracker.isExcluded(options.excludeSections)) {
          return;
        }
        const firstLine = getSource(node).split("\n")[0];
        if (fenceRe.test(firstLine)) {
          report(node, new RuleError(options.description));
        }
      },
    });
  };
}

/**
 * コメントアウトされていない textlint / mdformatter ディレクティブを検出する
 * ルールを作る (text-checker の TextlintFilterRule / MarkdownFormatterFilterRule 相当)。
 * ディレクティブは Html ノードとして現れる。判定は元実装と同じ行頭の正規表現
 * (`// ` などでコメントアウトされていれば許可) をノードの開始行に適用する。
 */
export function createDirectiveCommentRule(
  defaults: DirectiveCommentRuleDefaults
): TextlintRuleModule<TrackRuleOptions> {
  return function rule(context, userOptions) {
    const options = Object.assign({}, DEFAULT_OPTIONS, defaults, userOptions || {});
    const { Syntax, RuleError, report, getSource } = context;

    if (options.skipReadme && isReadme(context)) {
      return {} as TextlintRuleReportHandler;
    }

    const lineRe = new RegExp(toArray(options.regexp)[0]);
    let lines: string[] = [];

    return {
      [Syntax.Document](node: TxtNode) {
        lines = getSource(node).split("\n");
      },
      [Syntax.Html](node: TxtNodeWithValue) {
        if (!node.value || !node.value.includes(options.marker)) {
          return;
        }
        const line = lines[node.loc.start.line - 1] || "";
        if (lineRe.test(line)) {
          report(node, new RuleError(options.description));
        }
      },
    };
  };
}

/**
 * <!-- xxx-disable --> / <!-- xxx-enable --> の対応をチェックするルールを作る
 * (text-checker の TextlintFilterPairRule / MarkdownFormatterFilterPairRule 相当)。
 * perRuleName: true の場合 (textlint 用)、ルール名ごとに対応を判定する。
 * コードブロック内のディレクティブは Html ノードにならないため自然に対象外になる。
 */
export function createDirectivePairRule(
  defaults: DirectivePairRuleDefaults
): TextlintRuleModule<TrackRuleOptions> {
  return function rule(context, userOptions) {
    const options = Object.assign({}, DEFAULT_OPTIONS, defaults, userOptions || {});
    const { Syntax, RuleError, report, locator } = context;

    const re = new RegExp(options.filterRegexp.source, "g");

    interface DirectiveEntry {
      node: TxtNode;
      index: number;
      length: number;
    }
    // 対応する enable が現れていない disable の位置 (キー: ルール名)
    const startingFilter: Record<string, DirectiveEntry | null> = {};

    const reportAt = (entry: DirectiveEntry) => {
      report(
        entry.node,
        new RuleError(options.description, {
          padding: locator.range([entry.index, entry.index + entry.length]),
        })
      );
    };

    return {
      [Syntax.Html](node: TxtNodeWithValue) {
        const value: string = node.value || "";
        re.lastIndex = 0;
        let matched;
        while ((matched = re.exec(value)) !== null) {
          const isDisable = matched[1] === "disable";
          const key = options.perRuleName ? matched[2] : "";
          const isPair = Number(isDisable) ^ Number(Boolean(startingFilter[key]));
          const entry: DirectiveEntry = { node, index: matched.index, length: matched[0].length };
          if (!isPair) {
            reportAt(entry);
          }
          startingFilter[key] = isDisable ? entry : null;
        }
      },
      [`${Syntax.Document}:exit`]() {
        for (const entry of Object.values(startingFilter)) {
          if (entry) {
            reportAt(entry);
          }
        }
      },
    };
  };
}
