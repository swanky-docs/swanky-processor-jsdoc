'use strict';

const path = require('path');
const Dgeni = require('dgeni');
const mockPackageFn = require('../../../mocks/mockPackage');


describe('scriptTag fileReader', function() {

  let fileReader, delegate;

  const validScriptContent = `
    foo <script>
    /**
      * @module bar
      */
    export default function alertFn() {}
    </script>
    car
    <script>
    /**
      * @kind component
      */
    </script>
  `;

  let createFileInfo = function(file, content, basePath) {
    return {
      fileReader: fileReader.name,
      filePath: file,
      baseName: path.basename(file, path.extname(file)),
      extension: path.extname(file).replace(/^\./, ''),
      basePath: basePath,
      relativePath: path.relative(basePath, file),
      content: content
    };
  };

  beforeEach(function() {
    // Get our mock package and the scriptTag code to it as a factory
    let mockPackage = mockPackageFn().factory(require('./scriptTag'));

    let dgeni = new Dgeni([mockPackage]);
    let injector = dgeni.configureInjector();

    fileReader = injector.get('scriptTagFileReader');
    delegate = injector.get('jsdocFileReader');
  });

  describe('defaultPattern', function() {

    it('should only match js files', function() {
      expect(fileReader.defaultPattern.test('abc.html')).toBeTruthy();
      expect(fileReader.defaultPattern.test('abc.js')).toBeFalsy();
    });

  });


  describe('getDocs', function() {

    it('should filter the contents of the file before delegating to the jsdocFileReader.getDocs()', function() {
      let fileInfo = createFileInfo('some/file.js', validScriptContent, '.');

      jest.spyOn(delegate, 'getDocs');

      let docs = fileReader.getDocs(fileInfo);

      const expectedContent = '\n    /**\n      * @module bar\n      */\n    export default function alertFn() {}\n    \n\n    /**\n      * @kind component\n      */\n    ';

      expect(docs.length).toEqual(1);
      expect(docs[0]).toEqual(jasmine.objectContaining({ docType: 'jsFile' }));
      expect(delegate.getDocs).toHaveBeenCalledWith(jasmine.objectContaining({ content: expectedContent }));
    });

  });
});
