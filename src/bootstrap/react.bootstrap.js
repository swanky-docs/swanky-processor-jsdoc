'use strict';

// Functions required by the host project to support live editing of components for React
// This file should be imported by the host project's <framework>.bootstrap file

// Assume React and ReactDOM are included by host project
const React = require('react');
const ReactDOM = require('react-dom');

const editorBootstrap = require('./editor.bootstrap');

/*
 * @param dependentModulesArr   Format: {ComponentName: function ComponentName(...) {}, DatePicker: function DatePicker()...}
 */
module.exports = function (dependentModulesMap) {
  const WIN = window;

  // Bind React and other public methods to the window object
  WIN.React = React;
  WIN._secretReactRenderMethod = ReactDOM.render;

  // Export the default-export of each module onto the WINDOW object.
  // E.g.: window.DatePicker = function() ...
  // This allows Babel to compile JSX references to the component correctly. E.g. ReactDOM.render(<DatePicker id="..."/> works)
  Object.keys(dependentModulesMap).forEach(function (moduleKey) {
    WIN[moduleKey] = dependentModulesMap[moduleKey];
  });
}
