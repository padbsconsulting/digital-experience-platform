const Ajv = require("ajv/dist/2020");
const { loadConfig, readRoot } = require("./config");

const schema = JSON.parse(readRoot("config/themes.schema.json"));
const config = loadConfig();
const ajv = new Ajv({ allErrors: true, strict: true });
const validate = ajv.compile(schema);
const valid = validate(config);
const failures = [];

if (!valid) {
  for (const error of validate.errors || []) {
    failures.push(`${error.instancePath || "/"} ${error.message}`);
  }
}

function findDuplicates(items, label) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of items) {
    if (seen.has(item)) duplicates.add(item);
    seen.add(item);
  }
  for (const item of duplicates) failures.push(`Duplicate ${label}: ${item}`);
}

findDuplicates(config.activeHtmlPages?.map((page) => page.file) || [], "activeHtmlPages.file");
findDuplicates(config.activeHtmlPages?.map((page) => page.themePageId) || [], "activeHtmlPages.themePageId");

const regexGroups = [
  ["forbiddenCopyChecks", config.forbiddenCopyChecks || []],
  ["domainVocabularyBoundaryChecks", config.domainVocabularyBoundaryChecks || []],
  ["fictionalDataPosture.requiredSignals", (config.fictionalDataPosture?.requiredSignals || []).map((pattern) => ({ name: "requiredSignals", patterns: [pattern] }))],
  ["fictionalDataPosture.forbiddenRiskyPatterns", (config.fictionalDataPosture?.forbiddenRiskyPatterns || []).map((pattern) => ({ name: "forbiddenRiskyPatterns", patterns: [pattern] }))],
];

for (const [groupName, checks] of regexGroups) {
  for (const check of checks) {
    for (const pattern of check.patterns || []) {
      try {
        new RegExp(pattern, "i");
      } catch (error) {
        failures.push(`Invalid regex in ${groupName} (${check.name}): ${pattern} (${error.message})`);
      }
    }
  }
}

console.log(JSON.stringify({
  status: failures.length ? "FAIL" : "PASS",
  schema: "config/themes.schema.json",
  config: "config/active-theme.json",
  activeThemeId: config.activeThemeId,
  activePages: config.activeHtmlPages?.map((page) => page.file) || [],
  failures
}, null, 2));

if (failures.length) process.exitCode = 1;
