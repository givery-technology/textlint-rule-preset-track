# textlint-rule-preset-track

[![npm version](https://badge.fury.io/js/textlint-rule-preset-track.svg)](https://badge.fury.io/js/textlint-rule-preset-track) 
[![CircleCI](https://circleci.com/gh/givery-technology/textlint-rule-preset-track.svg?style=svg)](https://circleci.com/gh/givery-technology/textlint-rule-preset-track)

[textlint](https://textlint.github.io/) rule for [Track](https://github.com/givery-technology/track-contents).

## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint textlint-rule-preset-track --save-dev

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "preset-track": true
    }
}
```

Via CLI

```
textlint --preset track README.md
```

## ルール一覧

- [1文の長さは90文字以下とする](#1%E6%96%87%E3%81%AE%E9%95%B7%E3%81%95%E3%81%AF90%E6%96%87%E5%AD%97%E4%BB%A5%E4%B8%8B%E3%81%A8%E3%81%99%E3%82%8B)
- [コンマは1文中に3つまで](#%E3%82%B3%E3%83%B3%E3%83%9E%E3%81%AF1%E6%96%87%E4%B8%AD%E3%81%AB3%E3%81%A4%E3%81%BE%E3%81%A7)
- [読点は1文中に3つまで](#%E8%AA%AD%E7%82%B9%E3%81%AF1%E6%96%87%E4%B8%AD%E3%81%AB3%E3%81%A4%E3%81%BE%E3%81%A7)
- [連続できる最大の漢字長は6文字まで](#%E9%80%A3%E7%B6%9A%E3%81%A7%E3%81%8D%E3%82%8B%E6%9C%80%E5%A4%A7%E3%81%AE%E6%BC%A2%E5%AD%97%E9%95%B7%E3%81%AF6%E6%96%87%E5%AD%97%E3%81%BE%E3%81%A7)
- [全角数字を使用しない](#%E5%85%A8%E8%A7%92%E6%95%B0%E5%AD%97%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%AA%E3%81%84)
- [漢数字と算用数字を使い分けます](#%E6%BC%A2%E6%95%B0%E5%AD%97%E3%81%A8%E7%AE%97%E7%94%A8%E6%95%B0%E5%AD%97%E3%82%92%E4%BD%BF%E3%81%84%E5%88%86%E3%81%91%E3%81%BE%E3%81%99)
- [日付と曜日が矛盾していないかチェックする](#%E6%97%A5%E4%BB%98%E3%81%A8%E6%9B%9C%E6%97%A5%E3%81%8C%E7%9F%9B%E7%9B%BE%E3%81%97%E3%81%A6%E3%81%84%E3%81%AA%E3%81%84%E3%81%8B%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%81%99%E3%82%8B)
- [よくある英語のスペルミスをチェックする](#%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%8B%B1%E8%AA%9E%E3%81%AE%E3%82%B9%E3%83%9A%E3%83%AB%E3%83%9F%E3%82%B9%E3%82%92%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%81%99%E3%82%8B)
- [「ですます調」、「である調」を統一します](#%E3%81%A7%E3%81%99%E3%81%BE%E3%81%99%E8%AA%BF%E3%81%A7%E3%81%82%E3%82%8B%E8%AA%BF%E3%82%92%E7%B5%B1%E4%B8%80%E3%81%97%E3%81%BE%E3%81%99)
- [文末の句点記号として「。」を使います](#%E6%96%87%E6%9C%AB%E3%81%AE%E5%8F%A5%E7%82%B9%E8%A8%98%E5%8F%B7%E3%81%A8%E3%81%97%E3%81%A6%E3%82%92%E4%BD%BF%E3%81%84%E3%81%BE%E3%81%99)
- [二重否定は使用しない](#%E4%BA%8C%E9%87%8D%E5%90%A6%E5%AE%9A%E3%81%AF%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%AA%E3%81%84)
- [ら抜き言葉を使用しない](#%E3%82%89%E6%8A%9C%E3%81%8D%E8%A8%80%E8%91%89%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%AA%E3%81%84)
- [逆接の接続助詞「が」を連続して使用しない](#%E9%80%86%E6%8E%A5%E3%81%AE%E6%8E%A5%E7%B6%9A%E5%8A%A9%E8%A9%9E%E3%81%8C%E3%82%92%E9%80%A3%E7%B6%9A%E3%81%97%E3%81%A6%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%AA%E3%81%84)
- [同じ接続詞を連続して使用しない](#%E5%90%8C%E3%81%98%E6%8E%A5%E7%B6%9A%E8%A9%9E%E3%82%92%E9%80%A3%E7%B6%9A%E3%81%97%E3%81%A6%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%AA%E3%81%84)
- [同じ助詞を連続して使用しない](#%E5%90%8C%E3%81%98%E5%8A%A9%E8%A9%9E%E3%82%92%E9%80%A3%E7%B6%9A%E3%81%97%E3%81%A6%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%AA%E3%81%84)
- [UTF8-MAC 濁点を使用しない](#utf8-mac-%E6%BF%81%E7%82%B9%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%AA%E3%81%84)
- [TODOマークを残さない](#todo%E3%83%9E%E3%83%BC%E3%82%AF%E3%82%92%E6%AE%8B%E3%81%95%E3%81%AA%E3%81%84)
- [無効な制御文字を使用しない](#%E7%84%A1%E5%8A%B9%E3%81%AA%E5%88%B6%E5%BE%A1%E6%96%87%E5%AD%97%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%AA%E3%81%84)
- [括弧やクォーテーションなどの記号のペアの整合性をチェックする](#%E6%8B%AC%E5%BC%A7%E3%82%84%E3%82%AF%E3%82%A9%E3%83%BC%E3%83%86%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%AA%E3%81%A9%E3%81%AE%E8%A8%98%E5%8F%B7%E3%81%AE%E3%83%9A%E3%82%A2%E3%81%AE%E6%95%B4%E5%90%88%E6%80%A7%E3%82%92%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%81%99%E3%82%8B)
- [全角と半角アルファベットを混在させない](#%E5%85%A8%E8%A7%92%E3%81%A8%E5%8D%8A%E8%A7%92%E3%82%A2%E3%83%AB%E3%83%95%E3%82%A1%E3%83%99%E3%83%83%E3%83%88%E3%82%92%E6%B7%B7%E5%9C%A8%E3%81%95%E3%81%9B%E3%81%AA%E3%81%84)
- [サ抜き、サ入れ表現の誤用をチェックする](#%E3%82%B5%E6%8A%9C%E3%81%8D%E3%82%B5%E5%85%A5%E3%82%8C%E8%A1%A8%E7%8F%BE%E3%81%AE%E8%AA%A4%E7%94%A8%E3%82%92%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%81%99%E3%82%8B)
- [感嘆符!！、疑問符?？を使用しない](#%E6%84%9F%E5%98%86%E7%AC%A6%E7%96%91%E5%95%8F%E7%AC%A6%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%AA%E3%81%84)
- [半角カナを使用しない](#%E5%8D%8A%E8%A7%92%E3%82%AB%E3%83%8A%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%AA%E3%81%84)
- [弱い日本語表現を使用しない](#%E5%BC%B1%E3%81%84%E6%97%A5%E6%9C%AC%E8%AA%9E%E8%A1%A8%E7%8F%BE%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%AA%E3%81%84)
- [同一の単語を間違えて連続しているのをチェックする](#%E5%90%8C%E4%B8%80%E3%81%AE%E5%8D%98%E8%AA%9E%E3%82%92%E9%96%93%E9%81%95%E3%81%88%E3%81%A6%E9%80%A3%E7%B6%9A%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E3%81%AE%E3%82%92%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%81%99%E3%82%8B)
- [よくある日本語の誤用をチェックする](#%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%81%AE%E8%AA%A4%E7%94%A8%E3%82%92%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%81%99%E3%82%8B)
- [不自然なアルファベットを検知する](#%E4%B8%8D%E8%87%AA%E7%84%B6%E3%81%AA%E3%82%A2%E3%83%AB%E3%83%95%E3%82%A1%E3%83%99%E3%83%83%E3%83%88%E3%82%92%E6%A4%9C%E7%9F%A5%E3%81%99%E3%82%8B)
- [「〜たり〜たりする」をチェックする](#%E3%80%9C%E3%81%9F%E3%82%8A%E3%80%9C%E3%81%9F%E3%82%8A%E3%81%99%E3%82%8B%E3%82%92%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%81%99%E3%82%8B)
- [専門用語のスペルをチェックする](#%E5%B0%82%E9%96%80%E7%94%A8%E8%AA%9E%E3%81%AE%E3%82%B9%E3%83%9A%E3%83%AB%E3%82%92%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%81%99%E3%82%8B)
- [テクニカルワードをチェックする](#%E3%83%86%E3%82%AF%E3%83%8B%E3%82%AB%E3%83%AB%E3%83%AF%E3%83%BC%E3%83%89%E3%82%92%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%81%99%E3%82%8B)
- [表記ゆれをチェックする](#%E8%A1%A8%E8%A8%98%E3%82%86%E3%82%8C%E3%82%92%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%81%99%E3%82%8B)

### 1文の長さは90文字以下とする
> https://github.com/azu/textlint-rule-sentence-length

長過ぎる文は読みにくさに繋がるため、適切な単位で文を区切ってください。

```
"sentence-length": {
  max: 90
},
```

### コンマは1文中に3つまで
> https://github.com/azu/textlint-rule-max-comma

カンマ（,）の多用は、文が長くなっている可能性があります。

```
"max-comma": {
  max: 3
},
```

### 読点は1文中に3つまで
> https://github.com/azu/textlint-rule-max-ten

読点（、）の多用は、文が長くなっている可能性があります。

```
"max-ten": {
  max: 3
},
```

### 連続できる最大の漢字長は6文字まで
> https://github.com/azu/textlint-rule-max-kanji-continuous-len

漢字同士が連続していると読みにくさにつながります。
固有名詞は `allow` オプションに記述して回避します。

```
"max-kanji-continuous-len": {
  max: 6
},
```

### 全角数字を使用しない
> https://github.com/azu/textlint-rule-preset-JTF-style
> https://www.jtf.jp/jp/style_guide/styleguide_top.html


```
"no-zenkaku-numbers": true,
```

### 漢数字と算用数字を使い分けます
> https://github.com/azu/textlint-rule-preset-JTF-style
> https://www.jtf.jp/jp/style_guide/styleguide_top.html

数量を表現し、数を数えられるものは算用数字を使用します。
任意の数に置き換えても通用する語句がこれに該当します。
序数詞（「第～回」「～番目」「～回目」）も算用数字を使います。
慣用的表現、熟語、概数、固有名詞、副詞など、漢数字を使用することが一般的な語句では漢数字を使います。

```
"arabic-kanji-numbers": true,
```

### 日付と曜日が矛盾していないかチェックする
> https://github.com/azu/textlint-rule-date-weekday-mismatch


```
"date-weekday-mismatch": true,
```

### よくある英語のスペルミスをチェックする
> https://github.com/io-monad/textlint-rule-common-misspellings


```
"common-misspellings": true,
```

### 「ですます調」、「である調」を統一します
> https://github.com/azu/textlint-rule-no-mix-dearu-desumasu

- 見出しは自動
- 本文はですます調
- 箇条書きはである調
文体は見出し、本文、箇条書きの中では統一した表記にします。

```
"no-mix-dearu-desumasu": {
  "preferInHeader": "",
  "preferInBody": "ですます",
  "preferInList": "である",
  "strict": false
},
```

### 文末の句点記号として「。」を使います
> https://github.com/textlint-ja/textlint-rule-ja-no-mixed-period

文末には「。」を使い文を区切ります。
「。」のつけ忘れのチェックや「:」で文を区切らないようにします。

```
"ja-no-mixed-period": {
  "periodMark": "。",
  "forceAppendPeriod": true
},
```

### 二重否定は使用しない
> https://github.com/azu/textlint-rule-no-double-negative-ja


```
"no-double-negative-ja": true,
```

### ら抜き言葉を使用しない
> https://github.com/azu/textlint-rule-no-dropping-the-ra


```
"no-dropping-the-ra": true,
```

### 逆接の接続助詞「が」を連続して使用しない
> https://github.com/takahashim/textlint-rule-no-doubled-conjunctive-particle-ga

逆接の接続助詞「が」は、特に否定の意味ではなくても安易に使われてしまいがちです。
同一文中に複数回出現していないかどうかをチェックします。

```
"no-doubled-conjunctive-particle-ga": true,
```

### 同じ接続詞を連続して使用しない
> https://github.com/takahashim/textlint-rule-no-doubled-conjunction


```
"no-doubled-conjunction": true,
```

### 同じ助詞を連続して使用しない
> https://github.com/azu/textlint-rule-no-doubled-joshi


```
"no-doubled-joshi": {
  "min_interval": 1
},
```

### UTF8-MAC 濁点を使用しない
> https://github.com/azu/textlint-rule-no-nfd

文章中にUTF8-MAC 濁点は不要です。
ファイルからコピー＆ペーストした文字である場合があります。

```
"no-nfd": true,
```

### TODOマークを残さない
> https://github.com/textlint-rule/textlint-rule-no-todo


```
"no-todo": true,
```

### 無効な制御文字を使用しない
> https://github.com/textlint-rule/textlint-rule-no-invalid-control-character


```
"no-invalid-control-character": true,
```

### 括弧やクォーテーションなどの記号のペアの整合性をチェックする
> https://github.com/textlint-rule/textlint-rule-no-unmatched-pair


```
"no-unmatched-pair": true,
```

### 全角と半角アルファベットを混在させない
> https://github.com/textlint-ja/textlint-rule-no-mixed-zenkaku-and-hankaku-alphabet


```
"no-mixed-zenkaku-and-hankaku-alphabet": {
  "prefer": "半角"
},
```

### サ抜き、サ入れ表現の誤用をチェックする
> https://github.com/textlint-ja/textlint-rule-no-insert-dropping-sa


```
"no-insert-dropping-sa": true,
```

### 感嘆符!！、疑問符?？を使用しない
> https://github.com/azu/textlint-rule-no-exclamation-question-mark

特定の感嘆符または感嘆符を使用する場合は、オプションで許可して利用してください。

```
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
```

### 半角カナを使用しない
> https://github.com/azu/textlint-rule-no-hankaku-kana


```
"no-hankaku-kana": true,
```

### 弱い日本語表現を使用しない
> https://github.com/textlint-ja/textlint-rule-ja-no-weak-phrase

〜かもしれない 等の弱い表現を使用しない

```
"ja-no-weak-phrase": true,
```

### 同一の単語を間違えて連続しているのをチェックする
> https://github.com/textlint-ja/textlint-rule-ja-no-successive-word

同一の単語(形態素解析したtoken)が連続している場合は誤字の可能性があります。
誤字でない場合は、[Issue報告](https://github.com/textlint-ja/textlint-rule-ja-no-successive-word/issues/new)してください。

```
"ja-no-successive-word": true,
```

### よくある日本語の誤用をチェックする
> https://github.com/textlint-ja/textlint-rule-ja-no-abusage

日本語や技術表現における漢字の誤用などをチェックするルールです。

```
"ja-no-abusage": true,
```

### 不自然なアルファベットを検知する
> https://github.com/textlint-ja/textlint-rule-ja-unnatural-alphabet


```
"ja-unnatural-alphabet": true,
```

### 「〜たり〜たりする」をチェックする
> https://github.com/textlint-ja/textlint-rule-prefer-tari-tari


```
"prefer-tari-tari": true,
```

### 専門用語のスペルをチェックする
> https://github.com/sapegin/textlint-rule-terminology


```
"terminology": true,
```

### テクニカルワードをチェックする
> https://github.com/azu/textlint-rule-spellcheck-tech-word

WEB+DB PRESS用語統一ルールやJavaScript関連の用語などを含んだテクニカルワードをチェックするルールです。

```
"spellcheck-tech-word": true,
```

### 表記ゆれをチェックする
> https://github.com/azu/textlint-rule-prh

表記ゆれをチェックするルールです。

```
"prh": {
  "rulePaths": [
    path.join(__dirname, "prh.yml")
  ]
}
```

## Contribution

- `README.md` を更新する際は、 `/script/README_template.md` を編集し、 `npm run docs` を実行して自動生成してください（`README.md` は直接編集しないでください）。
