# CLAUDE.md

Track 教材 ([track-contents-course](https://github.com/givery-technology/track-contents-course)) 専用の textlint preset。**利用者はそのリポジトリのみ**であり、そこで使われない機能・ルール・オプションは持たない方針 (未使用になったら削除する)。

## コマンド

```sh
npm run build         # tsc (src/*.ts → lib/) + prh.yml のコピー
npm test              # ビルド + mocha (pretest でビルドされる)
npm run docs          # README.md を src のコメントから再生成
npm run test:docs     # README が再生成結果と一致するか検査
npm run test:example  # example/ で textlint を実際に実行する E2E
```

## 構成と不変条件

| パス | 内容 |
|:---|:---|
| `src/textlint-rule-preset-track.ts` | preset 定義 (rules / rulesConfig)。**rulesConfig のコメントが README の生成元** |
| `src/rules/track_rules.ts` | track 固有ルールの定義 (旧 text-checker からの移植。デフォルト値は track-contents-course の本番設定) |
| `src/rules/track_rule_helper.ts` | ルールのファクトリ (AST ベース。パターン検査 / コードブロック言語 / ディレクティブ検査) |
| `src/prh.yml` | 共通 prh 辞書 (ビルドで lib/ にコピーされる) |
| `lib/` | ビルド成果物 (**gitignore。直接編集しない**) |
| `script/` | README 生成 (`generate_readme.js` が src のコメント規約をパースする) |

- **README.md は自動生成。直接編集しない** (`script/README_template.md` を編集して `npm run docs`)。
- rulesConfig の各エントリには `// # タイトル` 形式のコメントを付ける (README のルール一覧になる。4スペースインデント前提でパースされるため崩さない)。
- ルール名は preset ロード時に `track/<ルール名>` という ID になる (textlint が `preset-` を外すため)。利用側の設定はこの ID を使う。

## track の表記スタイル (ルールの前提)

- **「、」は禁止** (track/no-ten)。読点は**全角カンマ「，」** (前後が半角英数字の場合などに半角カンマ「,」)。
  各ルールのオプション (例: no-doubled-joshi の `commaCharacters: ["，", ","]`) はこの前提で調整されている。
- 箇条書きのポリシーは「である調」だが、既存コンテンツ都合で利用側が緩和している (利用側 base.json 参照)。

## 削除したルール

削除の経緯・理由は README の「削除したルール」節が正本 (テンプレート側で管理)。要点:

- terminology (v5 の既定辞書が技術教材と不適合)、ja-no-mixed-period (誤判定過多)、max-ten (no-ten と併存で発火不能)。
- 新たにルールを削除するときは、(1) 利用側の全設定から参照を除去、(2) README テンプレートの「削除したルール」に理由を記録、(3) 下記の実データ検証、をセットで行う。

## 変更時の検証手順 (必須)

単体テストに加えて、**利用側リポジトリの実コンテンツ全体で検証**する:

1. track-contents-course (または検証用 worktree) に本リポジトリを `npm install --save-dev ../textlint-rule-preset-track` で注入
2. 全 `.textlintrc` (400+) に対して textlint を実行し、エラー 0 を確認する
   (2026-07 の移行時は `find contents -name .textlintrc | xargs -P8 ...` で全件スイープし、
   ルール変更ごとに (ルール, ファイル) 単位で新旧の検出差分を比較した)
3. 検出結果が変わる変更は、差分が意図どおりかを必ず件数と実例で確認する
   (例: commaCharacters の設定ミスで 236 件の誤検知が出た事故がある。スイープが検出した)

## リリース

- master マージ後に `npm publish` (semver。ルールの追加・削除・デフォルト変更は breaking として major)。
- 利用側 package.json は `^` 参照のため、major を上げない限り自動では入らない。
