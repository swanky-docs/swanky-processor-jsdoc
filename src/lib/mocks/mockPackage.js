'use strict';

var Package = require('dgeni').Package;

module.exports = function mockPackage() {

  return new Package('mockPackage', [
    require('dgeni-packages/jsdoc'),
    require('dgeni-packages/links')
  ])

  .factory(require('../links/link'))

  // provide a mock log service
  .factory('log', function() { return require('./log')(false); })

  // provide a mock template engine for the tests
  .factory('templateEngine', function dummyTemplateEngine() {});
};
