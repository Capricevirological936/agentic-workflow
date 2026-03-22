'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const {
  processSkeletonFile,
  SIMPLE_GENERATORS,
} = require('../generate.js');
const testManifest = require('./helpers/test-manifest.js');

describe('generate.js regressions', () => {
  it('processSkeletonFile returns outputContent for JS skeletons', () => {
    const result = processSkeletonFile(
      path.join(__dirname, '..', 'templates', 'core', 'hooks', 'code-review-check.skeleton.js'),
      testManifest
    );

    assert.equal(typeof result.outputContent, 'string');
    assert.match(result.outputContent, /const FILE_EXTENSIONS/);
    assert.ok(result.filled.includes('FILE_EXTENSIONS'));
  });

  it('SUBPROJECT_CONFIGS output includes configFile for auto-format hooks', () => {
    const output = SIMPLE_GENERATORS.SUBPROJECT_CONFIGS(testManifest, 'js');

    assert.match(output, /configFile:/);
  });

  it('package.json test script runs full node test discovery', () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
    );

    assert.match(packageJson.scripts.test, /^node --test\b/);
    assert.match(packageJson.scripts.test, /\.test\.js/);
    assert.doesNotMatch(packageJson.scripts.test, /templates\//);
  });
});
