const { spawnSync } = require("child_process");
const { loadConfig } = require("./config");

const config = loadConfig();
const files = [
  ...config.syntaxCheckFiles,
  ...config.requiredThemeAssets.filter((asset) => asset.endsWith(".js"))
];

const uniqueFiles = [...new Set(files)];
const failures = [];

for (const file of uniqueFiles) {
  const result = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8",
    shell: false
  });

  if (result.status !== 0) {
    failures.push({
      file,
      stdout: result.stdout.trim(),
      stderr: result.stderr.trim()
    });
  }
}

console.log(JSON.stringify({
  status: failures.length ? "FAIL" : "PASS",
  files: uniqueFiles,
  failures
}, null, 2));

if (failures.length) process.exitCode = 1;
