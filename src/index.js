'use strict';

const Dgeni = require('dgeni');
const path = require('path');
const builderFactory = require('./lib/builders');

const extensionLanguageMap = {
  '.ts': 'typescript',
};

function swankyJSDoc(page, item) {
  const language = getLanguage(item, page);
  const framework = getFramework(item);
  const builder = builderFactory(item, page, language, framework);
  const packages = [builder.Package];
  const dgeni = new Dgeni(packages);

  return dgeni.generate().then(function(docs) {
    return docs.map((doc) => doc.renderedContent);
  });
}

function getFramework(item) {
  const validFrameworkOptions = ['react', 'angular', 'js'];

  // Handle specific framework option if it exists
  const framework = (item.preprocessor['swanky-processor-jsdoc'].framework || 'js').toLowerCase();

  if (validFrameworkOptions.indexOf(framework) === -1) {
    throw Error(framework + ' is not a valid framework option. Using default JSDoc templates.');
  }

  return framework;
}


function getLanguage(item, page) {
  const validLanguageOptions = ['javascript', 'typescript'];  // In the future, TS code could live inside JS files, so we cannot rely *solely* on the file-type

  // Handle specific framework option if it exists
  const language = (item.preprocessor['swanky-processor-jsdoc'].language || extensionLanguageMap[path.extname(page.filename)] || 'javascript').toLowerCase();

  if (validLanguageOptions.indexOf(language) === -1) {
    throw Error(language + ' is not a valid language option. Choose from ' + validLanguageOptions.join(', '));
  }

  return language;
}

module.exports = swankyJSDoc;
