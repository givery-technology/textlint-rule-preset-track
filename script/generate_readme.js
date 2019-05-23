/***
 * `/lib/textlint-rule-preset-track.js` と `/script/README_template.md` から `/README.md` を生成する。
 * preset定義とREADMEのルール一覧の説明の二重管理を防ぐため、README.mdを直接編集せず、これを使う。
 * preset定義ファイルのフォーマットが崩れるとうまく動かなくなる可能性があるため注意。
 */

const fs = require('fs');
const path = require('path');

const PRESET_FILE = path.join(__dirname, '..', 'lib', 'textlint-rule-preset-track.js');
const README_TEMPLATE_FILE = path.join(__dirname, 'README_template.md');
const DEST_README_PATH = path.join(__dirname, '..', 'README.md');


function createRuleObjects (presetFileText) {
  const lines = presetFileText.split('\n');

  const rules = [];
  let currentRule;
  for (let line of lines) {
    if (!line.startsWith('    ')) continue;
    line = line.substr(4);

    if (line.startsWith('// ')) {
      // comment
      const comment = line.substr(3);
      if (comment.startsWith('# ')) {
        const rule = {
          title: comment.substr(2),
          urls: [],
          texts: [],
          codes: []
        };
        currentRule = rule;
        rules.push(rule);
      } else if (currentRule) {
        if (comment.startsWith('http')) {
          currentRule.urls.push(comment);
        } else {
          currentRule.texts.push(comment);
        }
      }
    } else if (currentRule) {
      // code
      currentRule.codes.push(line);
    }
  }

  return rules;
}

function generateRuleListText (rules) {
  const list = [];
  for (let {title} of rules) {
    list.push(`- [${title}](${encodeURIComponent(title)})`);
  }
  return list.join('\n');
}

function generateRuleDescriptionsText (rules) {
  const ruleTexts = [];
  for (let {title, urls, texts, codes} of rules) {
    ruleTexts.push([
      `### ${title}`,
      ...urls.map(url => `> ${url}`),
      '',
      ...texts,
      '',
      '```',
      ...codes.map(code => `${code}`),
      '```'
    ]);
  }
  return ruleTexts.map(rule => rule.join('\n')).join('\n\n');
}

function generateReadmeText (readmeTemplate, ruleListText, ruleDescriptionsText) {
  return readmeTemplate
    .replace('{RuleList}', ruleListText)
    .replace('{RuleDescriptions}', ruleDescriptionsText);
}

function main () {
  const presetFileText = fs.readFileSync(PRESET_FILE, 'utf-8');
  const readmeTemplateText = fs.readFileSync(README_TEMPLATE_FILE, 'utf-8');

  const rules = createRuleObjects(presetFileText);
  const ruleListText = generateRuleListText(rules);
  const ruleDescriptionsText = generateRuleDescriptionsText(rules);
  const readmeText = generateReadmeText(readmeTemplateText, ruleListText, ruleDescriptionsText);

  fs.writeFileSync(DEST_README_PATH, readmeText);
}

main();
