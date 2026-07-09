const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const configPath = path.join(root, "config", "active-theme.json");

function loadConfig() {
  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}

function resolveRoot(relPath) {
  return path.join(root, relPath);
}

function readRoot(relPath) {
  return fs.readFileSync(resolveRoot(relPath), "utf8");
}

function existsRoot(relPath) {
  return fs.existsSync(resolveRoot(relPath));
}

module.exports = {
  root,
  configPath,
  loadConfig,
  resolveRoot,
  readRoot,
  existsRoot
};
