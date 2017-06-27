'use strict';

const builderFactory = require('./index').builderFactory;

describe('BuilderFactory', () => {

  const validCombinations = [
    ['javascript', 'angular'],
    ['javascript', 'js'],
    ['javascript', 'react'],
    ['javascript', 'svelte'],
  ];

  const invalidCombinations = [
    ['javascript', 'foo'],
    ['typescript', 'angular'],
    ['typescript', 'js'],
    ['typescript', 'react'],
    ['typescript', 'svelte'],
    ['python', 'react'],
  ];

  it('should return a valid builder for valid combinations of framework and language', () => {
    const item = {};
    const page = {};

    validCombinations.forEach(input => {
      let builder = builderFactory(item, page, ...input);

      expect(builder).toBeDefined();
    });
  });


  it('should fail for invalid combinations of framework and language', () => {
    const item = {};
    const page = {};

    invalidCombinations.forEach(input => {
      expect(() => builderFactory(item, page, ...input)).toThrowError(`There is no doc-builder for this combination of language (${input[0]}) and framework (${input[1]})`);
    });
  });
});
