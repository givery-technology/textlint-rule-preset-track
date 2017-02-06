"use strict";

module.exports = {
  rules: {
    "preset-ja-technical-writing": require("textlint-rule-preset-ja-technical-writing"),
    "spellcheck-tech-word": require("textlint-rule-spellcheck-tech-word"),
    prh: require("textlint-rule-prh")
  },
  rulesConfig: {
    "preset-ja-technical-writing": true,
    "spellcheck-tech-word": true,
    prh: {
      rulePaths: ["lib/prh.yml"]
    }
  }
}
