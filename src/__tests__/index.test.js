'use strict';

const path = require('path');
const swankyAngularDocs = require('./../index');

let mockPage;
let mockJSItem;

beforeEach(() => {
  mockPage = {
    meta: {
      cssMap: {}
    },
    fileDependencies: []
  };

  mockJSItem = {
    contentSrc: path.join(__dirname, './../__mocks__/__fixtures__/angular-component.js'),
    preprocessor: {
      'swanky-processor-angular': {}
    }
  };
});

describe('swankyAngularDocs', () => {
  it('should exist', () => {
    expect(swankyAngularDocs).toBeDefined();
  });

  it('should return an array of processed ngdocs comments for a JS file', (done) => {
    swankyAngularDocs(mockPage, mockJSItem).then((result) => {
      expect(result.length).toBe(1);
      done();
    });
  });

  it('should handle a custom templates folder', (done) => {
    mockJSItem.preprocessor = {
      'swanky-processor-angular': {
        templates: 'src/__mocks__/__fixtures__/templates'
      }
    };

    swankyAngularDocs(mockPage, mockJSItem).then((result) => {
      expect(result.length).toBe(1);
      done();
    });
  });
});
