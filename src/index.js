'use strict';

const Dgeni = require('dgeni');
const path = require('path');
const builders = require('./lib/builders');

const extensionLanguageMap = {
  '.ts': 'typescript',
};

function swankyJSDoc(page, item) {
  const language = getLanguage(item, page);
  const framework = getFramework(item, language);
  const builder = builders.builderFactory(item, page, language, framework);
  const packages = [builder.Package];
  const dgeni = new Dgeni(packages);

  return dgeni.generate().then(function(docs) {
    return docs.map((doc) => doc.renderedContent);
  });
}

function getFramework(item, language) {
  const validLanguageOptions = builders.builderMap;

  // Handle specific framework option if it exists
  const framework = (item.preprocessor['swanky-processor-jsdoc'].framework || 'js').toLowerCase();

  if (!validLanguageOptions[language][framework]) {
    throw Error(`${framework} is not a valid framework option for ${language}. Choose from [${Object.keys(validLanguageOptions[language])}]`);
  }

  return framework;
}


function getLanguage(item, page) {
  const validLanguageOptions = builders.builderMap;

  // Handle specific framework option if it exists
  const language = (item.preprocessor['swanky-processor-jsdoc'].language || extensionLanguageMap[path.extname(page.filename)] || 'javascript').toLowerCase();

  if (!validLanguageOptions[language]) {
    throw Error(`${language} is not a valid language option. Choose from ${Object.keys(validLanguageOptions)}`);
  }

  return language;
}

module.exports = swankyJSDoc;
