'use strict';

const util = require('./astUtils');

fdescribe('astUtils', () => {

  describe('setMethodPropertiesFromAST', () => {

    it('should not change the doc when the there is no doc.codeNode', () => {
      let doc = {
        name: 'foo#bar'
      };

      util.setMethodPropertiesFromAST(doc);
      expect(doc).toEqual({name: 'foo#bar'});
      expect(doc.docType).toBeUndefined();
    });

    it('should not change the doc when doc.codeNode.type != "MethodDefinition"', () => {
      let doc = {
        codeNode: {
          type: 'foo'
        }
      };

      util.setMethodPropertiesFromAST(doc);
      expect(doc).toEqual({codeNode: {type: 'foo'}});
      expect(doc.docType).toBeUndefined();
    });


    it('should not change the doc when the doc.name already exists', () => {
      let doc = {
        codeNode: {
          type: 'MethodDefinition'
        },
        name: 'foo'
      };

      util.setMethodPropertiesFromAST(doc);
      expect(doc.docType).toBeUndefined();
      expect(doc.method).toBeUndefined();
    });

    it('should not change the doc when there is no doc.name but there is a doc.method', () => {
      let doc = {
        codeNode: {
          type: 'MethodDefinition'
        },
        method: 'foo'
      };

      util.setMethodPropertiesFromAST(doc);
      expect(doc.docType).toBeUndefined();
      expect(doc.method).toEqual('foo');
    });


    it('should not change the doc when there is no doc.name but there is a doc.function', () => {
      let doc = {
        codeNode: {
          type: 'MethodDefinition'
        },
        function: 'foo'
      };

      util.setMethodPropertiesFromAST(doc);
      expect(doc.docType).toBeUndefined();
      expect(doc.method).toBeUndefined();
    });


    it('should set the doc.name using the AST when there is at least a codeNode.key.name', () => {
      let doc = {
        codeAncestors: [
          {}
        ],
        codeNode: {
          type: 'MethodDefinition',
          key: { name: 'funcName', type: 'Identifier'}
        }
      };

      util.setMethodPropertiesFromAST(doc);
      expect(doc.name).toEqual('funcName');
      expect(doc.docType).toBeUndefined();
    });

    it('should set the doc.docType and doc.method using the AST when the code indicates the node belongs to a parent node with an id', () => {
      let doc = {
        codeAncestors: [
          {},
          {
            id: { name: 'moduleFoo', type: 'Identifier'}    // <!-- Algorithm uses this id
          },
          {
            id: { name: 'classYip', type: 'Identifier'}
          }
        ],
        codeNode: {
          type: 'MethodDefinition',
          key: { name: 'funcName', type: 'Identifier'}
        }
      };

      util.setMethodPropertiesFromAST(doc);
      expect(doc.name).toEqual('moduleFoo#funcName');
      expect(doc.docType).toEqual('method');
      expect(doc.method).toEqual('moduleFoo#funcName');
    });
  });


  describe('setMethodPropertiesFromJSDocAndAST', () => {

    it('should set the docType to "method" when the doc.name contains a #', () => {
      let doc = {
        name: 'foo#bar'
      };

      expect(util.setMethodPropertiesFromJSDocAndAST(doc)).toEqual('foo#bar');
      expect(doc.docType).toEqual('method');
      expect(doc.name).toEqual('foo#bar');
    });


    it('should set the docType to "method" when the value contains #', () => {
      let doc = {};

      expect(util.setMethodPropertiesFromJSDocAndAST(doc, null, 'value#foo')).toEqual('value#foo');
      expect(doc.docType).toEqual('method');
      expect(doc.name).toEqual('value#foo');
    });


    it('should set the docType to "method" when the AST indicates there is an ancestor with an identifier', () => {
      let doc = {
        codeAncestors: [
          {},
          {
            id: { name: 'moduleFoo', type: 'Identifier'}    // <!-- Algorithm uses this id
          },
          {
            id: { name: 'classYip', type: 'Identifier'}
          }
        ],
        codeNode: {
          key: { name: 'funcName', type: 'Identifier'}
        },
      };

      expect(util.setMethodPropertiesFromJSDocAndAST(doc, null, '')).toEqual('moduleFoo#funcName');
      expect(doc.docType).toEqual('method');
      expect(doc.name).toEqual('moduleFoo#funcName');
    });


    it('should not set the docType to "method" when the value does not contain #', () => {
      let doc = {
        name: 'topLevelThing'
      };

      expect(util.setMethodPropertiesFromJSDocAndAST(doc)).toEqual('topLevelThing');
      expect(doc.docType).toBeUndefined();
      expect(doc.name).toEqual('topLevelThing');
    });


    it('should not set the docType to "method" when the value of the tag does not contain #', () => {
      let doc = {};

      expect(util.setMethodPropertiesFromJSDocAndAST(doc, null, 'topLevelThing')).toEqual('topLevelThing');
      expect(doc.docType).toBeUndefined();
      expect(doc.name).toEqual('topLevelThing');
    });


    it('should not set the docType to "method" when the AST indicates there is no ancestor with an identifier', () => {
      let doc = {
        codeAncestors: [
          {}
        ],
        codeNode: {
          key: { name: 'funcName', type: 'Identifier'}
        },
      };

      expect(util.setMethodPropertiesFromJSDocAndAST(doc, null, '')).toEqual('funcName');
      expect(doc.docType).toBeUndefined();
      expect(doc.name).toEqual('funcName');
    });
  });

});
