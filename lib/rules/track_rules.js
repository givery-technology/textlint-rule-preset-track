"use strict";

// track-contents-course-automation の text-checker
// (contents/text_checker_config.json のルール群) からの移植。
// デフォルト値は移植時点の track-contents-course の本番設定に合わせている。
// 各ルールは .textlintrc のオプションで regexp / exclude /
// enabledInCodeBlock / enabledInCodeLine / excludeSections を上書きできる。

const { createRegexpRule, createDirectivePairRule } = require("./track_rule_helper");

// "codeprep"文字は使わない(ただし、URLとimageNameは許可する)
const noCodeprep = createRegexpRule({
  description: '"codeprep"文字は使わない(ただし、URLとimageNameは許可する)',
  regexp: ["codeprep"],
  exclude: ["https?:\\/\\/.*codeprep|imageName: ?codeprep\\/"],
  enabledInCodeBlock: true,
  enabledInCodeLine: true,
});

// 読点「、」を使わない
const noTen = createRegexpRule({
  description: "読点「、」を使わない",
  regexp: ["、"],
  enabledInCodeBlock: true,
  enabledInCodeLine: true,
});

// 全角文字の前・後に半角カンマを使わない
const noHankakuCommaAroundZenkaku = createRegexpRule({
  description: "全角文字の前・後に半角カンマを使わない",
  regexp: ["[^ -~\\s\\u201c\\u201d\\u2018\\u2019],", ",[^ -~\\s\\u201c\\u201d\\u2018\\u2019]"],
  enabledInCodeBlock: false,
  enabledInCodeLine: false,
  excludeSections: ["remote"],
});

// カンマの後はスペースを置く
const hankakuCommaSpace = createRegexpRule({
  description: "カンマの後はスペースを置く",
  regexp: [",[^ \\s]"],
  exclude: [
    "{,}",
    "\\d,\\d",
    "`,`",
    '","',
    "','",
    "`,,`",
    ',"',
    ",'",
    ",\\)",
    ",\\}",
    ",\\s*$",
  ],
  enabledInCodeBlock: false,
  enabledInCodeLine: false,
  excludeSections: ["remote"],
});

// コード中で全角数字が使われているかチェックする
const noZenkakuNum = createRegexpRule({
  description: "コード中で全角数字が使われているかチェックする",
  regexp: ["[０-９]"],
  enabledInCodeBlock: true,
  enabledInCodeLine: true,
});

// コード中で漢数字が使われているかチェックする(使って良い場合もある)
const noKanjiNum = createRegexpRule({
  description: "コード中で漢数字が使われているかチェックする(使って良い場合もある)",
  regexp: ["[一二三四五六七八九十]"],
  exclude: [
    "四則",
    ".項演算子",
    ".角",
    "一工夫",
    "二次方程式",
    "十分",
    "[同統単]一",
    "一[意例定見切応気般致律覧度括時貫緒部方連番々纏つ通言発元旦瞬点]",
    "二[乗度]",
    "一箇所",
    "一種[^類]",
    "一[列行][^目]",
    "..?進",
    "一目",
    ".重",
    "第一歩",
    "二分探索",
    "二分法",
    "四捨五入",
    "二倍長",
    "四分位",
    "三日月",
    "数十",
    "'[一二三]'",
    "九九",
  ],
  enabledInCodeBlock: false,
  enabledInCodeLine: true,
});

// textlint-filterはコメントアウトする (README.md は対象外)
const commentOutTextlintDirective = createRegexpRule({
  description: "textlint-filterはコメントアウトする",
  regexp: ["^([^/][^/] )?<!-- textlint"],
  enabledInCodeBlock: false,
  enabledInCodeLine: true,
  skipReadme: true,
});

// mdformatter-enable/disableはコメントアウトする
const commentOutMdformatterDirective = createRegexpRule({
  description: "mdformatter-enable/disableはコメントアウトする",
  regexp: ["^([^/][^/] )?<!-- mdformatter"],
  enabledInCodeBlock: false,
  enabledInCodeLine: true,
});

// コードブロックで言語を指定する(mainのコードブロックはどちらでも良い)
const codeBlockLanguage = createRegexpRule({
  description: "コードブロックで言語を指定する(mainのコードブロックはどちらでも良い)",
  regexp: ["^```\\s*$"],
  enabledInCodeBlock: true,
  enabledInCodeLine: true,
  excludeSections: ["main"],
  onlyCodeBlockOpening: true,
});

// textlint-filterの対応が取れていない
const textlintDirectivePair = createDirectivePairRule({
  description: "textlint-filterの対応が取れていない",
  filterRegexp: /<!-- textlint-(disable|enable) (.*) -->/,
  perRuleName: true,
  enabledInCodeBlock: false,
});

// mdformatter-enable/disableの対応が取れていない
const mdformatterDirectivePair = createDirectivePairRule({
  description: "mdformatter-enable/disableの対応が取れていない",
  filterRegexp: /<!-- mdformatter-(disable|enable) +-->/,
  perRuleName: false,
  enabledInCodeBlock: false,
});

module.exports = {
  "no-codeprep": noCodeprep,
  "no-ten": noTen,
  "no-hankaku-comma-around-zenkaku": noHankakuCommaAroundZenkaku,
  "hankaku-comma-space": hankakuCommaSpace,
  "no-zenkaku-num": noZenkakuNum,
  "no-kanji-num": noKanjiNum,
  "comment-out-textlint-directive": commentOutTextlintDirective,
  "comment-out-mdformatter-directive": commentOutMdformatterDirective,
  "code-block-language": codeBlockLanguage,
  "textlint-directive-pair": textlintDirectivePair,
  "mdformatter-directive-pair": mdformatterDirectivePair,
};
