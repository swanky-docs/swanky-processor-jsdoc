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
  require('dgeni-packages/typescript'),

  // require('dgeni-packages/links'),
])
  // // Processor that appends categorization flags to the docs, e.g. `isDirective`, `isNgModule`, etc.
  .processor(require('./processors/categorizer'))

  // // Processor that filters out symbols that should not be shown in the docs.
  .processor(require('./processors/docs-private-filter'))

  // Processor to group components into top-level groups such as "Tabs", "Sidenav", etc.
  // .processor(require('./processors/component-grouper'))

  // Configure the output path for written files (i.e., file names).
  .config(function(computePathsProcessor) {
    computePathsProcessor.pathTemplates = [{
      docTypes: ['componentGroup'],
      pathTemplate: '${name}',
      outputPathTemplate: '${name}.html',
    }];
  })

  // Configure custom JsDoc tags.
  .config(function(parseTagsProcessor) {
    parseTagsProcessor.tagDefinitions = parseTagsProcessor.tagDefinitions.concat([
      {name: 'docs-private'}
    ]);
  })

  .config(function(renderDocsProcessor) {
    // Provide the css map to the template rendering engine
    renderDocsProcessor.extraData.styles = page.data.meta.cssMap;

    // Make available option for specific framework
    if (page.item.preprocessor['swanky-processor-jsdoc'] &&
      page.item.preprocessor['swanky-processor-jsdoc'].hasOwnProperty('framework')) {
      renderDocsProcessor.extraData.framework = page.item.preprocessor['swanky-processor-jsdoc'].framework;
    } else {
      renderDocsProcessor.extraData.framework = 'ts';
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
    readFilesProcessor.$enabled = false; // disable for now as we are using readTypeScriptModules

    // We don't want to output the files here
    writeFilesProcessor.$enabled = false;
  })

  // Configure the processor for understanding TypeScript.
  .config(function(readTypeScriptModules) {

    readTypeScriptModules.basePath = process.cwd();

    // Specify our source files that we want to extract
    readTypeScriptModules.ignoreExportsMatching = [/^_/];
    readTypeScriptModules.hidePrivateMembers = true;

    // Entry points for docs generation. All publically exported symbols found through these
    // files will have docs generated.
    readTypeScriptModules.sourceFiles = page.item.contentSrc;
  })


  .config(function(templateFinder, templateEngine, renderDocsProcessor) {
    const framework = renderDocsProcessor.extraData.framework;

    // Read template location from Swanky config
    if (page.item.preprocessor['swanky-processor-jsdoc'] && page.item.preprocessor['swanky-processor-jsdoc'].hasOwnProperty('templates')) {
      templateFinder.templateFolders.unshift(path.join(process.cwd(), `${page.item.preprocessor['swanky-processor-jsdoc'].templates}/`));
    } else {
      templateFinder.templateFolders.unshift(path.join(__dirname, '../../../templates/'));
    }


    templateFinder.templatePatterns = [
      framework + '/${ doc.kind }.template.html',
      framework + '/${ doc.docType }.template.html',
      'js/${ doc.kind }.template.html',
      'js/${ doc.docType }.template.html',
      '${doc.area}/${ doc.kind }.template.html',
      '${ doc.kind }.template.html'
    ].concat(templateEngine.templatePatterns);


    // dgeni disables autoescape by default, but we want this turned on.
    templateEngine.config.autoescape = true;


    // Nunjucks and Angular conflict in their template bindings so change Nunjucks
    templateEngine.config.tags = {
      variableStart: '{$',
      variableEnd: '$}'
    };

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
