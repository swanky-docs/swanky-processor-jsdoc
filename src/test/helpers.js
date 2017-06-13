'use strict';

const readFile = require('fs').readFileSync;

// Remove the whitespace noise from the generated file
function trimGeneratedOutput(fileContent) {
  return fileContent[0]
    .replace(/\n\s*\n/g, '\n')
    .split('\n')
    .map(line => line.trim() === '' ? '' : line)
    .join('\n');
}


function getOutputFixture(filename) {
  return readFile(`${__dirname}/fixtures/output/${filename}`).toString();
}


// Returns an array containing the page
function getInputFixture(filename, framework, liveEdit) {

  const preprocessor = {
    'swanky-processor-jsdoc': {
      framework,
      liveEdit
    }
  };

  const mockItem = {
    compiledContent: [],
    contentSrc: [`${__dirname}/fixtures/input/${filename}`],
    key: 'key-derived-from-@name-attribute',
    preprocessor,
    title: 'Swanky Title',
    type: 'content'
  };

  const mockPage = {
    bootstrap: [],
    content: [
      {
        preprocessor,
        src: `input/${filename}`,
        title: 'Swanky Title'
      }
    ],
    filename: `${filename}`,
    key: 'components-cards',
    fileDependencies: [mockItem],
    meta: {
      cssMap: {}
    }
  };

  return [mockPage, mockItem];
}


module.exports = {
  getInputFixture,
  getOutputFixture,
  trimGeneratedOutput
};
