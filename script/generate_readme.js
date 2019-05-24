/***
 * `/lib/textlint-rule-preset-track.js` と `/script/README_template.md` から `/README.md` を生成する。
 * preset定義とREADMEのルール一覧の説明の二重管理を防ぐため、README.mdを直接編集せず、これを使う。
 * preset定義ファイルのフォーマットが崩れるとうまく動かなくなる可能性があるため注意。
 */

const fs = require('fs');
const path = require('path');

const {
  createRuleObjects,
  generateRuleListText,
  generateRuleDescriptionsText,
  generateReadmeText
} = require('./lib/readme_generator');

const PRESET_FILE = path.join(__dirname, '..', 'lib', 'textlint-rule-preset-track.js');
const README_TEMPLATE_FILE = path.join(__dirname, 'README_template.md');
const DEST_README_PATH = path.join(__dirname, '..', 'README.md');

const presetFileText = fs.readFileSync(PRESET_FILE, 'utf-8');
const readmeTemplateText = fs.readFileSync(README_TEMPLATE_FILE, 'utf-8');

const rules = createRuleObjects(presetFileText);
const ruleListText = generateRuleListText(rules);
const ruleDescriptionsText = generateRuleDescriptionsText(rules);
const readmeText = generateReadmeText(readmeTemplateText, ruleListText, ruleDescriptionsText);

fs.writeFileSync(DEST_README_PATH, readmeText);
