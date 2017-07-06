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
  require('dgeni-packages/links'),
])
  // Replaces the default link tag rendering with our custom one
  .factory(require('../../links/link'))
  .factory(require('./file-readers/scriptTag'))
  .factory(require('dgeni-packages/ngdoc/services/getTypeClass'))     // Needed to support @returns tags, which use the type-class filter

  // group member documentation into a single doc
  .processor(require('dgeni-packages/ngdoc/processors/memberDocs'))

  // Accept relative links to external files for examples
  .processor('examplesProcessor', require('./processors/examples-processor'))

  .config(function(parseTagsProcessor, getInjectables) {
    parseTagsProcessor.tagDefinitions =
      parseTagsProcessor.tagDefinitions.concat(getInjectables(require('./tag-defs')));
  })

  // Configure the jsdocFileReader to support JS & JSX
  .config(function(jsdocFileReader) {
    jsdocFileReader.defaultPattern = /\.(?:jsx?)$/;
  })

  .config(function(renderDocsProcessor) {
    // Provide the css map to the template rendering engine
    renderDocsProcessor.extraData.styles = page.data.meta.cssMap;

    // Make available option for specific framework
    if (page.item.preprocessor['swanky-processor-jsdoc'] &&
      page.item.preprocessor['swanky-processor-jsdoc'].hasOwnProperty('framework')) {
      renderDocsProcessor.extraData.framework = page.item.preprocessor['swanky-processor-jsdoc'].framework || 'js';
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

  .config(function(log, writeFilesProcessor, readFilesProcessor, scriptTagFileReader) {

    // Set the log level to 'info', switch to 'debug' when troubleshooting
    log.level = 'error';

    // We don't want to output the files here
    writeFilesProcessor.$enabled = false;

    // Specify the base path used when resolving relative paths to source and output files
    readFilesProcessor.basePath = process.cwd();

    // Specify our source files that we want to extract
    readFilesProcessor.sourceFiles = [{
      include: page.item.contentSrc
    }];

    // Include the scriptTag file-reader in the list of file-readers
    readFilesProcessor.fileReaders.push(scriptTagFileReader);

  })

  .config(function(templateEngine) {
    templateEngine.config.tags = {
      variableStart: '{$',
      variableEnd: '$}'
    };
  })

  .config(function(templateFinder, templateEngine, renderDocsProcessor, getInjectables) {
    const framework = renderDocsProcessor.extraData.framework;

    // Read template location from Swanky config
    if (page.item.preprocessor['swanky-processor-jsdoc'] && page.item.preprocessor['swanky-processor-jsdoc'].hasOwnProperty('templates')) {
      templateFinder.templateFolders.unshift(path.join(process.cwd(), `${page.item.preprocessor['swanky-processor-jsdoc'].templates}/`));
    } else {
      templateFinder.templateFolders.unshift(path.join(__dirname, '../../../templates/'));
    }

    templateFinder.templatePatterns = [
      framework + '/${ doc.kind }.template.html',
      '${doc.area}/${ doc.kind }.template.html',
      '${ doc.kind }.template.html'
    ].concat(templateEngine.templatePatterns);


    // Support the method.template.html template, which references 'code' blocks
    templateEngine.filters = templateEngine.filters.concat(getInjectables([
      require('dgeni-packages/ngdoc/rendering/filters/code'),
      require('dgeni-packages/ngdoc/rendering/filters/type-class')
    ]));

    templateEngine.tags = templateEngine.tags.concat(getInjectables([require('dgeni-packages/ngdoc/rendering/tags/code')]));


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
  })

  .config(function(computeIdsProcessor, getAliases) {

    computeIdsProcessor.idTemplates.push({
      docTypes: ['module' ],
      idTemplate: 'module:${name}',
      getAliases: getAliases
    });

    computeIdsProcessor.idTemplates.push({
      docTypes: ['method', 'property', 'event'],
      getId: function(doc) {
        let parts = doc.name.split('#');
        let name = parts.pop();

        parts.push(doc.docType + ':' + name);
        return parts.join('#');
      },
      getAliases: getAliases
    });

    computeIdsProcessor.idTemplates.push({
      docTypes: ['object', 'function', 'type' ],
      idTemplate: 'module:${module}.${docType}:${name}',
      getAliases: getAliases
    });
  })

  .config(function(computePathsProcessor) {
    computePathsProcessor.pathTemplates.push({
      docTypes: ['object', 'function', 'filter'],
      pathTemplate: '${area}/${module}/${docType}/${name}',
      outputPathTemplate: 'partials/${area}/${module}/${docType}/${name}.html'
    });
    computePathsProcessor.pathTemplates.push({
      docTypes: ['module' ],
      pathTemplate: '${area}/${name}',
      outputPathTemplate: 'partials/${area}/${name}/index.html'
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
