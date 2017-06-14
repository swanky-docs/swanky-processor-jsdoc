'use strict';

const swankyAngularDocs = require('./index');
const {getInputFixture, getOutputFixture, trimGeneratedOutput} = require('./test/helpers');

describe('swankyAngularDocs', () => {

  it('should return a promise that resolves to a generated file, using "JS" as the default framework with no liveEdit by default', () => {
    const expectedOutput = getOutputFixture('minimal-js-component.html');

    expect(swankyAngularDocs(...getInputFixture('minimal-js-component.js')).then(trimGeneratedOutput))
      .resolves.toEqual(expectedOutput);

    expect(expectedOutput).toContain('>name:<');
    expect(expectedOutput).toContain('description');
    expect(expectedOutput).not.toContain('>Live Edit<');
  });


  it('should generate output using the JS template with liveEdit, when specified', () => {
    const expectedOutput = getOutputFixture('full-js-component.html');

    expect(expectedOutput).toContain('>name:<');
    expect(expectedOutput).toContain('description');
    expect(expectedOutput).toContain('>Example<');
    expect(expectedOutput).toContain('>Live Edit<');
    expect(expectedOutput).toContain('>Deprecated API<');
    expect(expectedOutput).toContain('>Arguments<');
    expect(expectedOutput).not.toContain('>Events<');   // Not supported in JSdoc

    return expect(swankyAngularDocs(...getInputFixture('full-js-component.js', 'js', true)).then(trimGeneratedOutput))
      .resolves.toEqual(expectedOutput);
  });

  it('should generate output using the Angular/ngdoc template with liveEdit, when specified', () => {
    const expectedOutput = getOutputFixture('full-angular-component.html');

    expect(expectedOutput).toContain('>name:<');
    expect(expectedOutput).toContain('description');
    expect(expectedOutput).toContain('>Example<');
    expect(expectedOutput).toContain('>Live Edit<');
    expect(expectedOutput).toContain('>Deprecated API<');
    expect(expectedOutput).toContain('>Arguments<');
    expect(expectedOutput).toContain('>Events<');

    return expect(swankyAngularDocs(...getInputFixture('full-angular-component.js', 'angular', true)).then(trimGeneratedOutput))
      .resolves.toEqual(expectedOutput);
  });

  it('should generate output using the React template with liveEdit, when specified', () => {
    const expectedOutput = getOutputFixture('full-react-component.html');

    expect(expectedOutput).toContain('>name:<');
    expect(expectedOutput).toContain('description');
    expect(expectedOutput).toContain('>Example<');
    expect(expectedOutput).toContain('>Live Edit<');
    expect(expectedOutput).toContain('>Deprecated API<');
    expect(expectedOutput).toContain('>Arguments<');
    expect(expectedOutput).not.toContain('>Events<');   // Not supported in JSdoc

    return expect(swankyAngularDocs(...getInputFixture('full-react-component.js', 'react', true)).then(trimGeneratedOutput))
      .resolves.toEqual(expectedOutput);
  });
});
