'use strict';

const frameworkBuilderMap = {
  'react': './jsdoc-builder',
  'angular': './ngdoc-builder',
  'js': './jsdoc-builder',
  'ts': './tsdoc-builder'
};

module.exports = function(item, page, framework) {
  const Builder = require(frameworkBuilderMap[framework]);

  return new Builder(item, page);
};
