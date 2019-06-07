# textlint-rule-preset-track 

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

{RuleList}

{RuleDescriptions}

## Contribution

- `README.md` を更新する際は、 `/script/README_template.md` を編集し、 `npm run docs` を実行して自動生成してください（`README.md` は直接編集しないでください）。
