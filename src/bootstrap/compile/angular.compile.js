'use strict';

// Assume Angular is included by host project
const angular = require('angular');
const ROOT_MOD_NAME = 'swanky$$ModuleRoot';

module.exports = function(element, newContent) {
  const $injector = angular.injector(['ng', ROOT_MOD_NAME]);

  // use the injector to kick off your application
  $injector.invoke(['$rootScope', '$compile', function($rootScope, $compile) {
    const elem = angular.element(element);

    elem.empty();
    elem.append(newContent);
    $compile(elem)($rootScope);
    $rootScope.$digest();
  }]);
};