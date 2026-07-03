"use strict";

// track-contents-course-automation の text-checker (行ベース検査) からの移植。
// 既存コンテンツとの検査結果の互換性を最優先するため、
// AST ではなく生テキストを行単位で検査する実装をそのまま踏襲している。

const path = require("path");

const DEFAULT_OPTIONS = {
  enabledInCodeBlock: true,
  enabledInCodeLine: true,
  excludeSections: [],
};

function toArray(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * 行単位のスキャン。text-checker の RuleBase.test と同じ状態遷移
 * (``` によるコードブロックのトグル、## / ### セクションの追跡) を行う。
 *
 * testLine(line, index, opts) が { passed: false } を返した行が結果になる。
 */
function scanLines(text, options, testLine) {
  const lines = text.split("\n");
  let inCodeBlock = false;
  const section = { level: 0, name: null };
  const results = [];
  let offset = 0;

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const lineStart = offset;
    offset += line.length + 1;

    let isChangedCodeBlock = false;
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      isChangedCodeBlock = true;
    }
    if (!inCodeBlock) {
      const sectionMatched = line.match(/^(###?) (.+?)(\(|$)/);
      if (sectionMatched) {
        section.level = sectionMatched[1].length;
        section.name = sectionMatched[2];
      }
    }

    if (inCodeBlock && !options.enabledInCodeBlock) {
      continue;
    }
    if (section.name !== null && options.excludeSections.includes(section.name)) {
      continue;
    }

    const res = testLine(line, index, { inCodeBlock, isChangedCodeBlock, section });
    if (res && !res.passed) {
      results.push({ line, index, lineStart, lineEnd: lineStart + line.length });
    }
  }

  return results;
}

/** 行番号 (0-based) から行の開始/終了オフセットを求める */
function lineRange(text, index) {
  const lines = text.split("\n");
  let offset = 0;
  for (let i = 0; i < index; i++) {
    offset += lines[i].length + 1;
  }
  return [offset, offset + lines[index].length];
}

/** インラインコード (`...`) の内側かどうか。text-checker の isInCodeLine の移植 */
function isInCodeLine(line, index) {
  const lr = [line.substring(0, index), line.substring(index)].map((x) => x.replace("\\`", ""));
  const backQuoteCnts = lr.map((t) => t.split("").filter((c) => c === "`").length);
  return backQuoteCnts[0] % 2 === 1 && backQuoteCnts[1] % 2 === 1;
}

/**
 * 正規表現ベースのルールを作る。text-checker の RegexpRule の移植。
 *
 * defaults: {
 *   description, regexp, exclude,
 *   enabledInCodeBlock, enabledInCodeLine, excludeSections,
 *   skipReadme (README.md を検査対象外にするか)
 * }
 * ユーザーオプション (.textlintrc) で個別に上書きできる。
 */
function createRegexpRule(defaults) {
  return function rule(context, userOptions) {
    const options = Object.assign({}, DEFAULT_OPTIONS, defaults, userOptions || {});
    const { Syntax, report, RuleError, locator, getSource, getFilePath } = context;

    return {
      [Syntax.Document](node) {
        if (options.skipReadme) {
          const filePath = getFilePath();
          if (filePath && path.basename(filePath) === "README.md") {
            return;
          }
        }

        const regexps = toArray(options.regexp).map((r) => new RegExp(r, "g"));
        const excludes = toArray(options.exclude).map((e) => new RegExp(e, "g"));
        const text = getSource(node);

        const results = scanLines(text, options, (line, _index, opts) => {
          // コードブロックの開始行のみ検査するモード (code-block-language 用。
          // text-checker の CodeBlockLanguageRule.testLine の移植)
          if (options.onlyCodeBlockOpening && (!opts.inCodeBlock || !opts.isChangedCodeBlock)) {
            return { passed: true };
          }
          for (const e of excludes) {
            e.lastIndex = 0;
            line = line.replace(e, "");
          }
          const ms = regexps.map((r) => {
            r.lastIndex = 0;
            return r.exec(line);
          });
          const passed = ms.every(
            (m) => m === null || (!options.enabledInCodeLine && isInCodeLine(line, m.index))
          );
          return { passed };
        });

        for (const r of results) {
          report(
            node,
            new RuleError(options.description, {
              padding: locator.range([r.lineStart, r.lineEnd]),
            })
          );
        }
      },
    };
  };
}

/**
 * <!-- xxx-disable --> / <!-- xxx-enable --> の対応をチェックするルールを作る。
 * text-checker の TextlintFilterPairRule / MarkdownFormatterFilterPairRule の移植。
 *
 * defaults: { description, filterRegexp, perRuleName, enabledInCodeBlock, ... }
 * perRuleName: true の場合 (textlint 用)、ルール名ごとに対応を判定する。
 */
function createDirectivePairRule(defaults) {
  return function rule(context, userOptions) {
    const options = Object.assign({}, DEFAULT_OPTIONS, defaults, userOptions || {});
    const { Syntax, report, RuleError, locator, getSource } = context;

    return {
      [Syntax.Document](node) {
        const text = getSource(node);
        const startingFilterLine = {};

        const results = scanLines(text, options, (line, index) => {
          const matched = line.match(options.filterRegexp);
          if (matched) {
            const startingFilter = matched[1] === "disable";
            const key = options.perRuleName ? matched[2] : "";
            const isPair = Number(startingFilter) ^ Number(!!startingFilterLine[key]);
            startingFilterLine[key] = startingFilter ? { line, index } : null;
            return { passed: isPair };
          }
          return { passed: true };
        });

        // 対応する enable が現れなかった disable を末尾で報告する
        for (const v of Object.values(startingFilterLine)) {
          if (v) {
            const [lineStart, lineEnd] = lineRange(text, v.index);
            results.push({ line: v.line, index: v.index, lineStart, lineEnd });
          }
        }

        for (const r of results) {
          report(
            node,
            new RuleError(options.description, {
              padding: locator.range([r.lineStart, r.lineEnd]),
            })
          );
        }
      },
    };
  };
}

module.exports = {
  DEFAULT_OPTIONS,
  scanLines,
  lineRange,
  isInCodeLine,
  createRegexpRule,
  createDirectivePairRule,
};
