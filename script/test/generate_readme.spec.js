const assert = require("assert");
const fs = require('fs');
const path = require('path');

const {
  createRuleObjects,
  generateRuleListText,
  generateRuleDescriptionsText,
  generateReadmeText
} = require('../lib/readme_generator');

const PRESET_FILE = path.join(__dirname, '..', '..', 'lib', 'textlint-rule-preset-track.js');
const README_TEMPLATE_FILE = path.join(__dirname, '..', 'README_template.md');
const EXISTED_README_FILE = path.join(__dirname, '..', '..', 'README.md');

const presetFileText = fs.readFileSync(PRESET_FILE, 'utf-8');
const readmeTemplateText = fs.readFileSync(README_TEMPLATE_FILE, 'utf-8');
const existedReadmeText = fs.readFileSync(EXISTED_README_FILE, 'utf-8');

describe("script/generate_readme.js", function() {
  it("generated readme text matches existed readme text", function() {
    const rules = createRuleObjects(presetFileText);
    const ruleListText = generateRuleListText(rules);
    const ruleDescriptionsText = generateRuleDescriptionsText(rules);
    const readmeText = generateReadmeText(readmeTemplateText, ruleListText, ruleDescriptionsText);
    assert.equal(readmeText, existedReadmeText);
  });
});
