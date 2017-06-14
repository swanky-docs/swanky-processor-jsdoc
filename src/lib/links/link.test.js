'use strict';

var mockPackage = require('./mocks/mockPackage');
var Dgeni = require('dgeni');

describe('links inline tag handler', function() {
  var tagDef, getLinkInfoSpy, doc, log;

  beforeEach(function() {

    getLinkInfoSpy = jest.fn();

    var testPackage = mockPackage()
      .factory('getLinkInfo', function() {
        return getLinkInfoSpy;
      });

    var dgeni = new Dgeni([testPackage]);
    var injector = dgeni.configureInjector();

    log = injector.get('log');
    tagDef = injector.get('linkInlineTagDef');

    doc = {
      id: 'module:ng.directive:ngInclude',
      path: 'api/ng/directive/ngInclude',
      componentType: 'directive',
      module: 'ng',
      name: 'ngInclude',
      area: 'api',
      file: 'some/file.js',
      startingLine: 200,
      renderedContent: 'Some text with a {@link some/url link} to somewhere\n' +
                       'A fully qualified link {@link http://www.odecee.com.au MyTitle}\n' +
                       'Another text with a {@link another/url that spans\n two lines}\n' +
                       'Some example with a code link: {@link module:ngOther.directive:ngDirective}\n' +
                       'A link to reachable code: {@link ngInclude}'
    };

  });

  it('should have name "link"', function() {
    expect(tagDef.name).toEqual('link');
  });

  it('should use the result of getLinkInfo to create a HTML anchor', function() {
    getLinkInfoSpy.mockReturnValue({
      valid: true,
      url: 'some/url',
      title: 'link'
    });
    expect(tagDef.handler(doc, 'link', 'some/url link')).toEqual('<a href="some/url">link</a>');
    expect(getLinkInfoSpy.mock.calls.length).toEqual(1);
  });


  it('should log a warning if the link is invalid', function() {
    getLinkInfoSpy.mockReturnValue({
      valid: false,
      error: 'Invalid link (does not match any doc): "module:ngOther.directive:ngDirective"'
    });
    tagDef.handler(doc, 'link', 'module:ngOther.directive:ngDirective');
    expect(log.warn.mock.calls[0][0]).toEqual('Invalid link (does not match any doc): "module:ngOther.directive:ngDirective" - doc "module:ng.directive:ngInclude"');
    expect(getLinkInfoSpy.mock.calls.length).toEqual(1);
  });


  it('should detect when a link has already been converted by Nunjucks, and re-parse it', function() {
    getLinkInfoSpy.mockReturnValue({
      valid: true,
      url: 'http://www.foo.bar',
      title: 'Odecee'
    });
    expect(tagDef.handler(doc, 'title', '<a href="http://www.foo.bar">http://www.foo.bar</a> TITLE')).toEqual('<a href="http://www.foo.bar">Odecee</a>');
    expect(getLinkInfoSpy.mock.calls[0][0]).toEqual('http://www.foo.bar');
    expect(getLinkInfoSpy.mock.calls[0][1]).toEqual('TITLE');     // Note that the function was passed the TITLE from the source code, but returns 'Odecee' in the mock.
  });
});
