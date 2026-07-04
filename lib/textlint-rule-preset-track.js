"use strict";
const interopRequire = require("interop-require");
const path = require("path");
const jtfRules = require("textlint-rule-preset-jtf-style").rules;
const aiWritingRules = interopRequire("textlint-rule-preset-ai-writing").rules;
const trackRules = require("./rules/track_rules");

module.exports = {
  rules: {
    "sentence-length": interopRequire("textlint-rule-sentence-length"),
    "max-comma": interopRequire("textlint-rule-max-comma"),
    "max-ten": interopRequire("textlint-rule-max-ten"),
    "max-kanji-continuous-len": interopRequire("textlint-rule-max-kanji-continuous-len"),
    "no-mix-dearu-desumasu": interopRequire("textlint-rule-no-mix-dearu-desumasu"),
    "ja-no-mixed-period": interopRequire("textlint-rule-ja-no-mixed-period"),
    "no-zenkaku-numbers": jtfRules["2.1.8.算用数字"],
    "arabic-kanji-numbers": jtfRules["2.2.2.算用数字と漢数字の使い分け"],
    "date-weekday-mismatch": interopRequire("textlint-rule-date-weekday-mismatch"),
    "common-misspellings": interopRequire("textlint-rule-common-misspellings"),
    "no-doubled-conjunction": interopRequire("textlint-rule-no-doubled-conjunction"),
    "no-doubled-conjunctive-particle-ga": interopRequire("textlint-rule-no-doubled-conjunctive-particle-ga"),
    "no-double-negative-ja": interopRequire("textlint-rule-no-double-negative-ja"),
    "no-doubled-joshi": interopRequire("textlint-rule-no-doubled-joshi"),
    "no-dropping-the-ra": interopRequire("textlint-rule-no-dropping-the-ra"),
    "no-nfd": interopRequire("textlint-rule-no-nfd"),
    "no-todo": interopRequire("textlint-rule-no-todo"),
    "no-invalid-control-character": interopRequire("@textlint-rule/textlint-rule-no-invalid-control-character"),
    "no-unmatched-pair": interopRequire("@textlint-rule/textlint-rule-no-unmatched-pair"),
    "no-mixed-zenkaku-and-hankaku-alphabet": interopRequire("textlint-rule-no-mixed-zenkaku-and-hankaku-alphabet"),
    "no-insert-dropping-sa": interopRequire("@textlint-ja/textlint-rule-no-insert-dropping-sa"),
    "no-exclamation-question-mark": interopRequire("textlint-rule-no-exclamation-question-mark"),
    "no-hankaku-kana": interopRequire("textlint-rule-no-hankaku-kana"),
    "ja-no-weak-phrase": interopRequire("textlint-rule-ja-no-weak-phrase"),
    "ja-no-successive-word": interopRequire("textlint-rule-ja-no-successive-word"),
    "ja-no-abusage": interopRequire("textlint-rule-ja-no-abusage"),
    "ja-unnatural-alphabet": interopRequire("textlint-rule-ja-unnatural-alphabet"),
    "prefer-tari-tari": interopRequire("textlint-rule-prefer-tari-tari"),
    "spellcheck-tech-word": interopRequire("textlint-rule-spellcheck-tech-word"),
    "prh": interopRequire("textlint-rule-prh"),
    "no-ai-list-formatting": aiWritingRules["no-ai-list-formatting"],
    "no-ai-hype-expressions": aiWritingRules["no-ai-hype-expressions"],
    "no-ai-emphasis-patterns": aiWritingRules["no-ai-emphasis-patterns"],
    "ai-tech-writing-guideline": aiWritingRules["ai-tech-writing-guideline"],
    "no-codeprep": trackRules["no-codeprep"],
    "no-ten": trackRules["no-ten"],
    "no-hankaku-comma-around-zenkaku": trackRules["no-hankaku-comma-around-zenkaku"],
    "hankaku-comma-space": trackRules["hankaku-comma-space"],
    "no-zenkaku-num": trackRules["no-zenkaku-num"],
    "no-inuki": trackRules["no-inuki"],
    "no-kanji-num": trackRules["no-kanji-num"],
    "comment-out-textlint-directive": trackRules["comment-out-textlint-directive"],
    "comment-out-mdformatter-directive": trackRules["comment-out-mdformatter-directive"],
    "code-block-language": trackRules["code-block-language"],
    "textlint-directive-pair": trackRules["textlint-directive-pair"],
    "mdformatter-directive-pair": trackRules["mdformatter-directive-pair"]
  },
  rulesConfig: {
    // # 1文の長さは90文字以下とする
    // 長過ぎる文は読みにくさに繋がるため、適切な単位で文を区切ってください。
    // https://github.com/azu/textlint-rule-sentence-length
    "sentence-length": {
      max: 90
    },

    // # コンマは1文中に3つまで
    // カンマ（,）の多用は、文が長くなっている可能性があります。
    // https://github.com/azu/textlint-rule-max-comma
    "max-comma": {
      max: 3
    },

    // # 読点は1文中に3つまで
    // 読点（、）の多用は、文が長くなっている可能性があります。
    // https://github.com/azu/textlint-rule-max-ten
    "max-ten": {
      max: 3
    },

    // # 連続できる最大の漢字長は6文字まで
    // 漢字同士が連続していると読みにくさにつながります。
    // 固有名詞は `allow` オプションに記述して回避します。
    // https://github.com/azu/textlint-rule-max-kanji-continuous-len
    "max-kanji-continuous-len": {
      max: 6
    },

    // # 全角数字を使用しない
    // https://github.com/azu/textlint-rule-preset-JTF-style
    // https://www.jtf.jp/jp/style_guide/styleguide_top.html
    "no-zenkaku-numbers": true,

    // # 漢数字と算用数字を使い分けます
    // 数量を表現し、数を数えられるものは算用数字を使用します。
    // 任意の数に置き換えても通用する語句がこれに該当します。
    // 序数詞（「第～回」「～番目」「～回目」）も算用数字を使います。
    // 慣用的表現、熟語、概数、固有名詞、副詞など、漢数字を使用することが一般的な語句では漢数字を使います。
    // https://github.com/azu/textlint-rule-preset-JTF-style
    // https://www.jtf.jp/jp/style_guide/styleguide_top.html
    "arabic-kanji-numbers": true,

    // # 日付と曜日が矛盾していないかチェックする
    // https://github.com/azu/textlint-rule-date-weekday-mismatch
    "date-weekday-mismatch": true,

    // # よくある英語のスペルミスをチェックする
    // https://github.com/io-monad/textlint-rule-common-misspellings
    "common-misspellings": true,

    // # 「ですます調」、「である調」を統一します
    // - 見出しは自動
    // - 本文はですます調
    // - 箇条書きはである調
    // 文体は見出し、本文、箇条書きの中では統一した表記にします。
    // https://github.com/azu/textlint-rule-no-mix-dearu-desumasu
    "no-mix-dearu-desumasu": {
      "preferInHeader": "",
      "preferInBody": "ですます",
      "preferInList": "である",
      "strict": false
    },

    // # 文末の句点記号として「。」を使います
    // 文末には「。」を使い文を区切ります。
    // 「。」のつけ忘れのチェックや「:」で文を区切らないようにします。
    // https://github.com/textlint-ja/textlint-rule-ja-no-mixed-period
    "ja-no-mixed-period": {
      "periodMark": "。",
      "forceAppendPeriod": true
    },

    // # 二重否定は使用しない
    // https://github.com/azu/textlint-rule-no-double-negative-ja
    "no-double-negative-ja": true,

    // # ら抜き言葉を使用しない
    // https://github.com/azu/textlint-rule-no-dropping-the-ra
    "no-dropping-the-ra": true,

    // # 逆接の接続助詞「が」を連続して使用しない
    // 逆接の接続助詞「が」は、特に否定の意味ではなくても安易に使われてしまいがちです。
    // 同一文中に複数回出現していないかどうかをチェックします。
    // https://github.com/takahashim/textlint-rule-no-doubled-conjunctive-particle-ga
    "no-doubled-conjunctive-particle-ga": true,

    // # 同じ接続詞を連続して使用しない
    // https://github.com/takahashim/textlint-rule-no-doubled-conjunction
    "no-doubled-conjunction": true,

    // # 同じ助詞を連続して使用しない
    // https://github.com/azu/textlint-rule-no-doubled-joshi
    "no-doubled-joshi": {
      "min_interval": 1
    },

    // # UTF8-MAC 濁点を使用しない
    // 文章中にUTF8-MAC 濁点は不要です。
    // ファイルからコピー＆ペーストした文字である場合があります。
    // https://github.com/azu/textlint-rule-no-nfd
    "no-nfd": true,

    // # TODOマークを残さない
    // https://github.com/textlint-rule/textlint-rule-no-todo
    "no-todo": true,

    // # 無効な制御文字を使用しない
    // https://github.com/textlint-rule/textlint-rule-no-invalid-control-character
    "no-invalid-control-character": true,

    // # 括弧やクォーテーションなどの記号のペアの整合性をチェックする
    // https://github.com/textlint-rule/textlint-rule-no-unmatched-pair
    "no-unmatched-pair": true,

    // # 全角と半角アルファベットを混在させない
    // https://github.com/textlint-ja/textlint-rule-no-mixed-zenkaku-and-hankaku-alphabet
    "no-mixed-zenkaku-and-hankaku-alphabet": {
      "prefer": "半角"
    },

    // # サ抜き、サ入れ表現の誤用をチェックする
    // https://github.com/textlint-ja/textlint-rule-no-insert-dropping-sa
    "no-insert-dropping-sa": true,

    // # 感嘆符!！、疑問符?？を使用しない
    // 特定の感嘆符または感嘆符を使用する場合は、オプションで許可して利用してください。
    // https://github.com/azu/textlint-rule-no-exclamation-question-mark
    "no-exclamation-question-mark": {
      // allow to use !
      "allowHalfWidthExclamation": false,
      // allow to use ！
      "allowFullWidthExclamation": true,
      // allow to use ?
      "allowHalfWidthQuestion": false,
      // allow to use ？
      "allowFullWidthQuestion": true
    },

    // # 半角カナを使用しない
    // https://github.com/azu/textlint-rule-no-hankaku-kana
    "no-hankaku-kana": true,

    // # 弱い日本語表現を使用しない
    // 〜かもしれない 等の弱い表現を使用しない
    // https://github.com/textlint-ja/textlint-rule-ja-no-weak-phrase
    "ja-no-weak-phrase": true,

    // # 同一の単語を間違えて連続しているのをチェックする
    // 同一の単語(形態素解析したtoken)が連続している場合は誤字の可能性があります。
    // 誤字でない場合は、[Issue報告](https://github.com/textlint-ja/textlint-rule-ja-no-successive-word/issues/new)してください。
    // https://github.com/textlint-ja/textlint-rule-ja-no-successive-word
    "ja-no-successive-word": true,

    // # よくある日本語の誤用をチェックする
    // 日本語や技術表現における漢字の誤用などをチェックするルールです。
    // https://github.com/textlint-ja/textlint-rule-ja-no-abusage
    "ja-no-abusage": true,

    // # 不自然なアルファベットを検知する
    // https://github.com/textlint-ja/textlint-rule-ja-unnatural-alphabet
    "ja-unnatural-alphabet": true,

    // # 「〜たり〜たりする」をチェックする
    // https://github.com/textlint-ja/textlint-rule-prefer-tari-tari
    "prefer-tari-tari": true,

    // # テクニカルワードをチェックする
    // WEB+DB PRESS用語統一ルールやJavaScript関連の用語などを含んだテクニカルワードをチェックするルールです。
    // https://github.com/azu/textlint-rule-spellcheck-tech-word
    "spellcheck-tech-word": true,

    // # 表記ゆれをチェックする
    // 表記ゆれをチェックするルールです。
    // https://github.com/azu/textlint-rule-prh
    "prh": {
      "rulePaths": [
        path.join(__dirname, "prh.yml")
      ]
    },

    // # AI的な機械的リスト形式をチェックする
    // 箇条書き項目での「**強調**: 説明」のような機械的なパターンを検出します。
    // (textlint-rule-preset-ai-writing より)
    // https://github.com/textlint-ja/textlint-rule-preset-ai-writing
    "no-ai-list-formatting": true,

    // # AI的な誇張表現をチェックする
    // 「革命的」「劇的に」のようなAI文章にありがちな誇張表現を検出します。
    // (textlint-rule-preset-ai-writing より)
    // https://github.com/textlint-ja/textlint-rule-preset-ai-writing
    "no-ai-hype-expressions": true,

    // # AI的な強調パターンをチェックする
    // 見出し代わりの太字乱用など、AI文章にありがちな強調パターンを検出します。
    // (textlint-rule-preset-ai-writing より)
    // https://github.com/textlint-ja/textlint-rule-preset-ai-writing
    "no-ai-emphasis-patterns": true,

    // # テクニカルライティングのガイドラインに沿っているかチェックする
    // documentation guideline に基づく情報提供ルールです (severity: info)。
    // (textlint-rule-preset-ai-writing より)
    // https://github.com/textlint-ja/textlint-rule-preset-ai-writing
    "ai-tech-writing-guideline": {
      "severity": "info"
    },

    // # "codeprep"文字は使わない
    // 旧サービス名の "codeprep" は使えません (URL と imageName は許可)。
    // (text-checker からの移植ルール)
    "no-codeprep": true,

    // # 読点「、」を使わない
    // track の教材では読点に「,」を使います。
    // (text-checker からの移植ルール。YAML 中の検査は text-checker が担当)
    "no-ten": true,

    // # 全角文字の前・後に半角カンマを使わない
    // 全角文字と半角カンマの隣接は「、」の変換ミスの可能性があります。
    // (text-checker からの移植ルール)
    "no-hankaku-comma-around-zenkaku": true,

    // # カンマの後はスペースを置く
    // 文章中の「,」の後には半角スペースを置いてください。
    // (text-checker からの移植ルール)
    "hankaku-comma-space": true,

    // # 全角数字を使わない
    // 全角数字「０-９」ではなく半角数字を使ってください。
    // (text-checker からの移植ルール)
    "no-zenkaku-num": true,

    // # い抜き言葉を使わない
    // 「てます」「てました」などのい抜き言葉は「ています」のように書いてください。
    // (text-checker からの移植ルール)
    "no-inuki": true,

    // # 漢数字を使わない (warning)
    // 数量を表す場合は算用数字を使ってください (慣用表現は exclude 済み)。
    // 使って良い場合もあるため severity は warning です。
    // (text-checker からの移植ルール。旧 required: false 相当)
    "no-kanji-num": {
      "severity": "warning"
    },

    // # textlint ディレクティブはコメントアウトする
    // <!-- textlint-disable --> などをそのまま書くと表示されるため、
    // コメントアウトした形でのみ許可します (README.md は対象外)。
    // (text-checker からの移植ルール)
    "comment-out-textlint-directive": true,

    // # mdformatter ディレクティブはコメントアウトする
    // <!-- mdformatter-disable --> なども同様にコメントアウトが必要です。
    // (text-checker からの移植ルール)
    "comment-out-mdformatter-directive": true,

    // # コードブロックで言語を指定する
    // ``` の後に言語を指定してください (main セクションは任意)。
    // (text-checker からの移植ルール)
    "code-block-language": true,

    // # textlint ディレクティブの対応を取る
    // <!-- textlint-disable x --> には対応する <!-- textlint-enable x --> が必要です。
    // (text-checker からの移植ルール)
    "textlint-directive-pair": true,

    // # mdformatter ディレクティブの対応を取る
    // <!-- mdformatter-disable --> には対応する <!-- mdformatter-enable --> が必要です。
    // (text-checker からの移植ルール)
    "mdformatter-directive-pair": true
  }
};
