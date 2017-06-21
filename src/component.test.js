'use strict';

const swankyAngularDocs = require('./index');
const {getInputFixture, getOutputFixture, trimGeneratedOutput} = require('./test/helpers');

describe('swankyAngularDocs processing components', () => {

  it('should generate minimal component docs using "JS" as the default framework with no liveEdit by default', () => {
    const expectedOutput = getOutputFixture('component-minimal-js.html');

    expect(expectedOutput).toContain('>Name:<');
    expect(expectedOutput).toContain('description');
    expect(expectedOutput).not.toContain('>Live Edit<');

    return expect(swankyAngularDocs(...getInputFixture('component-minimal-js.js')).then(trimGeneratedOutput))
      .resolves.toEqual(expectedOutput);
  });

  it('should generate minimal component docs using "JS" as the default framework with no liveEdit by default from a HTML file', () => {
    const expectedOutput = getOutputFixture('component-minimal-js.html');

    expect(expectedOutput).toContain('>Name:<');
    expect(expectedOutput).toContain('description');
    expect(expectedOutput).not.toContain('>Live Edit<');

    return expect(swankyAngularDocs(...getInputFixture('component-minimal-svelte.html')).then(trimGeneratedOutput))
      .resolves.toEqual(expectedOutput);
  });


  it('should generate full component docs with JS and liveEdit', () => {
    const expectedOutput = getOutputFixture('component-full-js.html');

    expect(expectedOutput).toContain('>Name:<');
    expect(expectedOutput).toContain('description');
    expect(expectedOutput).toContain('>Example<');
    expect(expectedOutput).toContain('>Live Edit<');
    expect(expectedOutput).toContain('>Deprecated API<');
    expect(expectedOutput).toContain('>Arguments<');
    expect(expectedOutput).toContain('>Events<');
    expect(expectedOutput).toContain('>Methods<');

    return expect(swankyAngularDocs(...getInputFixture('component-full-js.js', 'js', true)).then(trimGeneratedOutput))
      .resolves.toEqual(expectedOutput);
  });

  it('should generate full component docs with Angular/ngdoc and liveEdit', () => {
    const expectedOutput = getOutputFixture('component-full-angular.html');

    expect(expectedOutput).toContain('>Name:<');
    expect(expectedOutput).toContain('description');
    expect(expectedOutput).toContain('>Example<');
    expect(expectedOutput).toContain('>Live Edit<');
    expect(expectedOutput).toContain('>Deprecated API<');
    expect(expectedOutput).toContain('>Arguments<');
    expect(expectedOutput).toContain('>Events<');
    expect(expectedOutput).toContain('>Methods<');

    return expect(swankyAngularDocs(...getInputFixture('component-full-angular.js', 'angular', true)).then(trimGeneratedOutput))
      .resolves.toEqual(expectedOutput);
  });

  it('should generate full component docs with React and liveEdit', () => {
    const expectedOutput = getOutputFixture('component-full-react.html');

    expect(expectedOutput).toContain('>Name:<');
    expect(expectedOutput).toContain('description');
    expect(expectedOutput).toContain('>Example<');
    expect(expectedOutput).toContain('>Live Edit<');
    expect(expectedOutput).toContain('>Deprecated API<');
    expect(expectedOutput).toContain('>Arguments<');
    expect(expectedOutput).toContain('>Events<');
    expect(expectedOutput).toContain('>Methods<');

    return expect(swankyAngularDocs(...getInputFixture('component-full-react.js', 'react', true)).then(trimGeneratedOutput))
      .resolves.toEqual(expectedOutput);
  });
});
