'use strict';

// Functions required by the host project to support live editing of components for Svelte
// This file should be imported by the host project's <framework>.bootstrap file

require('./editor.bootstrap');

/*
 * Renders the Svelte component in the example window
 * @param dependentModulesArr   Format: {ComponentName: function ComponentName(...) {}, DatePicker: function DatePicker()...}
 */
module.exports = function (dependentModulesMap) {
  const WIN = window;

  // Export the default-export of each module onto the WINDOW object.
  // E.g.: window.DatePicker = function() ...
  // This allows Babel to compile code that refers to the component correctly. E.g. "new Notification(...)" works)
  Object.keys(dependentModulesMap).forEach(function (moduleKey) {
    WIN[moduleKey] = dependentModulesMap[moduleKey];
  });
}
