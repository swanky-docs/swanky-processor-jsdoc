'use strict';

const Dgeni = require('dgeni');
const builderFactory = require('./lib/builders');

function swankyJSDoc(page, item) {
  const framework = getFramework(item);
  const builder = builderFactory(item, page, framework);
  const packages = [builder.Package];
  const dgeni = new Dgeni(packages);

  return dgeni.generate().then(function(docs) {
    return docs.map((doc) => doc.renderedContent);
  });
}

function getFramework(item) {
  const validFrameworkOptions = ['react', 'angular', 'js'];

  // Handle specific framework option if it exists
  const framework = item.preprocessor['swanky-processor-jsdoc'].framework ?
    item.preprocessor['swanky-processor-jsdoc'].framework : 'js';

  if (validFrameworkOptions.indexOf(framework) === -1) {
    throw Error(framework + ' is not a valid framework option. Using default JSDoc templates.');
  }

  return framework;
}

module.exports = swankyJSDoc;
