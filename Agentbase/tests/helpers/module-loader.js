'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { createRequire } = require('module');

function loadModuleExports(filePath, options = {}) {
  let source = fs.readFileSync(filePath, 'utf8');
  source = source.replace(/^#!.*\n/, '');

  if (Array.isArray(options.replacements)) {
    for (const replacement of options.replacements) {
      source = source.replace(replacement.find, replacement.replace);
    }
  }

  source = source.replace(
    /\nmain\(\);\s*$/,
    `\nmodule.exports = { ${options.exports.join(', ')} };\n`
  );

  const module = { exports: {} };
  const localRequire = createRequire(filePath);
  const context = {
    Buffer,
    __dirname: path.dirname(filePath),
    __filename: filePath,
    clearTimeout,
    console,
    exports: module.exports,
    module,
    process,
    require: localRequire,
    setTimeout,
    ...(options.context || {}),
  };

  vm.runInNewContext(source, context, { filename: filePath });
  return module.exports;
}

module.exports = {
  loadModuleExports,
};
