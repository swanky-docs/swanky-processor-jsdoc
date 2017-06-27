'use strict';

const builderMap = {
  'javascript': {
    'angular': './ngdoc-builder',
    'js': './jsdoc-builder',
    'react': './jsdoc-builder',
    'svelte': './jsdoc-builder'
  },
  // Not yet implemented...
  // 'typescript': {
  //   'react': './tsdoc-builder',
  //   'angular': './tsdoc-builder',
  //   'js': './tsdoc-builder'
  // }
};

function BuilderFactory(item, page, language, framework) {
  let builderPath = (builderMap[language] || {})[framework];

  if (!builderPath) {
    throw new Error(`There is no doc-builder for this combination of language (${language}) and framework (${framework})`);
  }

  const Builder = require(builderPath);

  return new Builder(item, page);
};

module.exports = {
  builderFactory: BuilderFactory,
  builderMap
};
