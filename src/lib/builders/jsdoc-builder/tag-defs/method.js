'use strict';

const util = require('./astUtils');

module.exports = function() {
  return {
    name: 'method',
    defaultFn: util.setMethodPropertiesFromAST,
    transforms: util.setMethodPropertiesFromJSDocAndAST
  };
};
