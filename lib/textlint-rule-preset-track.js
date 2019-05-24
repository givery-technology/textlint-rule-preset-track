"use strict";
const interopRequire = require("interop-require");
const path = require("path");
const jtfRules = require("textlint-rule-preset-jtf-style").rules;

module.exports = {
  rules: {
    "sentence-length": interopRequire("textlint-rule-sentence-length"),
    "max-comma": interopRequire("textlint-rule-max-comma"),
    "max-ten": interopRequire("textlint-rule-max-ten"),
    "max-kanji-continuous-len": interopRequire("textlint-rule-max-kanji-continuous-len"),
    "no-mix-dearu-desumasu": interopRequire("textlint-rule-no-mix-dearu-desumasu"),
    "ja-no-mixed-period": interopRequire("textlint-rule-ja-no-mixed-period"),
    "arabic-kanji-numbers": jtfRules["2.2.2.算用数字と漢数字の使い分け"],
    "no-doubled-conjunction": interopRequire("textlint-rule-no-doubled-conjunction"),
    "no-doubled-conjunctive-particle-ga": interopRequire("textlint-rule-no-doubled-conjunctive-particle-ga"),
    "no-double-negative-ja": interopRequire("textlint-rule-no-double-negative-ja"),
    "no-doubled-joshi": interopRequire("textlint-rule-no-doubled-joshi"),
    "no-dropping-the-ra": interopRequire("textlint-rule-no-dropping-the-ra"),
    "no-nfd": interopRequire("textlint-rule-no-nfd"),
    "no-exclamation-question-mark": interopRequire("textlint-rule-no-exclamation-question-mark"),
    "no-hankaku-kana": interopRequire("textlint-rule-no-hankaku-kana"),
    "ja-no-weak-phrase": interopRequire("textlint-rule-ja-no-weak-phrase"),
    "ja-no-successive-word": interopRequire("textlint-rule-ja-no-successive-word"),
    "ja-no-abusage": interopRequire("textlint-rule-ja-no-abusage"),
    "spellcheck-tech-word": interopRequire("textlint-rule-spellcheck-tech-word"),
    "prh": interopRequire("textlint-rule-prh")
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

    // # 漢数字と算用数字を使い分けます
    // 数量を表現し、数を数えられるものは算用数字を使用します。
    // 任意の数に置き換えても通用する語句がこれに該当します。
    // 序数詞（「第～回」「～番目」「～回目」）も算用数字を使います。
    // 慣用的表現、熟語、概数、固有名詞、副詞など、漢数字を使用することが一般的な語句では漢数字を使います。
    // https://github.com/azu/textlint-rule-preset-JTF-style
    // https://www.jtf.jp/jp/style_guide/styleguide_top.html
    "arabic-kanji-numbers": true,

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
      "strict": true
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
    }
  }
};
