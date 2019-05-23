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
    list.push(`- [${title}](#${encodeURIComponent(title)})`);
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

module.exports = {
  createRuleObjects,
  generateRuleListText,
  generateRuleDescriptionsText,
  generateReadmeText
};
