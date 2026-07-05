# textlint-rule-preset-track

[![npm version](https://badge.fury.io/js/textlint-rule-preset-track.svg)](https://badge.fury.io/js/textlint-rule-preset-track) 
[![Actions Status](https://github.com/givery-technology/textlint-rule-preset-track/workflows/CI/badge.svg)](https://github.com/givery-technology/textlint-rule-preset-track/actions)

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

{RuleList}

{RuleDescriptions}

## 削除したルール

過去に含まれていて削除したルールとその理由 (v2.0.0):

- **terminology**: v5 で既定辞書が大幅拡大し、`git` などのコマンド名まで校正対象になり技術教材と相性が悪いため削除。必要になったら textlint-rule-terminology を利用側で直接導入し、辞書を絞って設定する。
- **ja-no-mixed-period**: 誤判定が多く、利用側 (track-contents-course) でもほぼ全体で無効化されていたため削除。
- **max-ten**: 「、」の多用チェックだが、track では `no-ten` が「、」自体を全面禁止しているため原理的に発火不能だった。「,」の多用チェックは `max-comma` が担当する。

## Contribution

- `README.md` を更新する際は、 `/script/README_template.md` を編集し、 `npm run docs` を実行して自動生成してください（`README.md` は直接編集しないでください）。
