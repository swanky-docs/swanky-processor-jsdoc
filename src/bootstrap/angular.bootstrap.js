'use strict';

// Functions required by the host project to support live editing of components for Angular 1.x
// This file should be imported by the host project's <framework>.bootstrap file

// Assume Angular is included by host project
const angular = require('angular');
const editorBootstrap = require('./editor.bootstrap');
const ROOT_MOD_NAME = 'swanky$$ModuleRoot';

/*
 * @param dependentModulesArr   Format: {'com.feature.moduleName': moduleObj, ...}
 */
module.exports = function (dependentModulesMap) {
  const dependentModulesArr = Object.keys(dependentModulesMap).map((key) => dependentModulesMap[key]);

  angular.module(ROOT_MOD_NAME, dependentModulesArr);

  angular.element(document).ready(function() {
    angular.bootstrap(document, [ROOT_MOD_NAME]);
  });
};
