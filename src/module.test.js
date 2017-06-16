'use strict';

const swankyAngularDocs = require('./index');
const {getInputFixture, getOutputFixture, trimGeneratedOutput} = require('./test/helpers');

describe('swankyAngularDocs processing modules', () => {

  it('should generate minimal module docs from an ngdoc module file', () => {
    const expectedOutput = getOutputFixture('module-minimal-angular.html');

    expect(expectedOutput).toContain('>myApp.components.accordion<');
    expect(expectedOutput).toContain('Installation');

    return expect(swankyAngularDocs(...getInputFixture('module-minimal-angular.js', 'angular')).then(trimGeneratedOutput))
      .resolves.toEqual(expectedOutput);
  });

  it('should generate minimal module docs from a JS module file', () => {
    const expectedOutput = getOutputFixture('module-minimal-js.html');

    expect(expectedOutput).toContain('>myModule<');
    expect(expectedOutput).toContain('>Module Components<');

    return expect(swankyAngularDocs(...getInputFixture('module-minimal-js.js', 'js')).then(trimGeneratedOutput))
      .resolves.toEqual(expectedOutput);
  });

});
