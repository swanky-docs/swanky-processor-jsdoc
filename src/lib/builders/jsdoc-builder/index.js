'use strict';

const fs = require('fs');
const path = require('path');
const find = require('lodash/find');
const Package = require('dgeni').Package;

// Create empty page object ready to collect data
let page = {};

const JSDocBuilder = function(item, doc) {
  page.item = item;
  page.data = doc;
};

JSDocBuilder.prototype.Package = new Package('jsdoc-builder', [
  require('dgeni-packages/jsdoc'),
  require('dgeni-packages/nunjucks'),
  require('dgeni-packages/links')
])
  // Replaces the default link tag rendering with our custom one
  .factory(require('../../links/link'))

  // Accept relative links to external files for examples
  .processor('examplesProcessor', require('./processors/examples-processor'))
  .config(function(parseTagsProcessor, getInjectables) {
    parseTagsProcessor.tagDefinitions =
      parseTagsProcessor.tagDefinitions.concat(getInjectables(require('./tag-defs')));
  })
  // Configure the jsdocFileReader to support JS & JSX
  .config(function(jsdocFileReader) {
    jsdocFileReader.defaultPattern = /\.jsx?$/;
  })
  .config(function(renderDocsProcessor) {
    // Provide the css map to the template rendering engine
    renderDocsProcessor.extraData.styles = page.data.meta.cssMap;

    // Make available option for specific framework
    if (page.item.preprocessor['swanky-processor-jsdoc'] &&
      page.item.preprocessor['swanky-processor-jsdoc'].hasOwnProperty('framework')) {
      renderDocsProcessor.extraData.framework = page.item.preprocessor['swanky-processor-jsdoc'].framework;
    } else {
      renderDocsProcessor.extraData.framework = 'js';
    }

    // should we enable the live edit region?
    if (page.item.preprocessor['swanky-processor-jsdoc'] &&
      page.item.preprocessor['swanky-processor-jsdoc'].hasOwnProperty('liveEdit')) {
      renderDocsProcessor.extraData.isLiveEdit = !!page.item.preprocessor['swanky-processor-jsdoc'].liveEdit;
    } else {
      renderDocsProcessor.extraData.isLiveEdit = false;
    }
  })
  .config(function(log, readFilesProcessor, writeFilesProcessor) {

    // Set the log level to 'info', switch to 'debug' when troubleshooting
    log.level = 'error';

    // Specify the base path used when resolving relative paths to source and output files
    readFilesProcessor.basePath = process.cwd();

    // Specify our source files that we want to extract
    readFilesProcessor.sourceFiles = [{
      include: page.item.contentSrc
    }];

    // We don't want to output the files here
    writeFilesProcessor.$enabled = false;
  })
  .config(function(templateEngine) {
    templateEngine.config.tags = {
      variableStart: '{$',
      variableEnd: '$}'
    };
  })
  .config(function(templateFinder, templateEngine, renderDocsProcessor) {
    const framework = renderDocsProcessor.extraData.framework;

    // Read template location from Swanky config
    if (page.item.preprocessor['swanky-processor-jsdoc'] && page.item.preprocessor['swanky-processor-jsdoc'].hasOwnProperty('templates')) {
      templateFinder.templateFolders.unshift(path.join(process.cwd(), `${page.item.preprocessor['swanky-processor-jsdoc'].templates}/`));
    } else {
      templateFinder.templateFolders.unshift(path.join(__dirname, '../../../templates/'));
    }

    // templateFinder.templatePatterns.unshift('api/component.template.html');

    // console.log('framework', framework);
    // console.log('kind', doc.kind);
    // console.log('area', doc.area);
    // console.log('id', doc.id);

    templateFinder.templatePatterns = [
      framework + '/${ doc.kind }.template.html',
      '${doc.area}/${ doc.kind }.template.html',
      '${ doc.kind }.template.html'
    ].concat(templateEngine.templatePatterns);

    // add fileDependencies to webpack config
    let fileDependencies = recursiveReaddirSync(templateFinder.templateFolders[0]);

    fileDependencies.forEach((item) => {
      // Only add template dependency if it doesn't already exist
      if(!find(page.data.fileDependencies, {'contentSrc': [item]})) {
        page.data.fileDependencies.push({
          contentSrc: [item], // expects an array
          type: 'template'
        });
      }
    });
  });

/**
 * Recursively read files from source directory
 * @param {String} dir - source directory to walk
 * @returns {Array} - list of files
 */
function recursiveReaddirSync(dir) {
  let list = [];
  let files = fs.readdirSync(dir);
  let stats;

  files.forEach(function(file) {
    stats = fs.lstatSync(path.join(dir, file));

    if(stats.isDirectory()) {
      list = list.concat(recursiveReaddirSync(path.join(dir, file)));
    } else {
      list.push(path.join(dir, file));
    }
  });

  return list;
}

module.exports = JSDocBuilder;
