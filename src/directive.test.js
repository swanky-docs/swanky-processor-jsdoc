'use strict';

const swankyAngularDocs = require('./index');
const {getInputFixture, getOutputFixture, trimGeneratedOutput} = require('./test/helpers');

describe('swankyAngularDocs processing directives', () => {

  it('should generate full directive docs with Angular/ngdoc and liveEdit', () => {
    const expectedOutput = getOutputFixture('component-full-angular.html');

    expect(expectedOutput).toContain('>Name:<');
    expect(expectedOutput).toContain('description');
    expect(expectedOutput).toContain('>Example<');
    expect(expectedOutput).toContain('>Live Edit<');
    expect(expectedOutput).toContain('>Deprecated API<');
    expect(expectedOutput).toContain('>Arguments<');
    expect(expectedOutput).toContain('>Events<');
    expect(expectedOutput).toContain('>Methods<');

    return expect(swankyAngularDocs(...getInputFixture('directive-full-angular.js', 'angular', true)).then(trimGeneratedOutput))
      .resolves.toEqual(expectedOutput);
  });

});
