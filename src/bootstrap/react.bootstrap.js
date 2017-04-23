'use strict';

// Functions required by the host project to support live editing of components for React
// This file should be imported by the host project's <framework>.bootstrap file

// Assume React and ReactDOM are included by host project
const React = require('react');
const ReactDOM = require('react-dom');

// Code Editor
const CodeMirror = require('codemirror/lib/codemirror');
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/lib/codemirror.css');
require('codemirror/mode/javascript/javascript.js');

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

  function reactCompile(elem, newContent) {
    elem.textContent = '';  // Clear the existing content

    // Babel is defined in the React live-update template via an external script
    var result;

    try {
      // babel preset react should be imported by leaf module
      result = Babel.transform('_secretReactRenderMethod(' + newContent + ', elem);', { presets: ['es2015', 'react'] });
    } catch (err) {
      // console.log(err);
    }

    // Strangely, Babel doesn't eval the code automatically
    if (result) {
      eval(result.code);
    }
  }

  function onChangeLiveEditReact(element, value) {
    reactCompile(element, value);
  }

  // setup code mirror instances for live editing
  function setupLiveEdit() {
    // Create a new Code Mirror instance for each editor
    const liveEditors = document.getElementsByClassName('react-live-editor');

    for (var i = 0; i < liveEditors.length; i++) {
      (function (index) {
        const editor = liveEditors[index];

        const codeMirrorInstance = CodeMirror.fromTextArea(editor, {
          lineNumbers: true,
          lineWrapping: true,
          mode: {
            name: "htmlmixed",
            highlightFormatting: true
          },
          theme: 'swanky'
        })

        const outputEl = document.getElementsByClassName(editor.dataset.output)[0];

        codeMirrorInstance.on('change', function (codeMirror) {
          onChangeLiveEditReact(outputEl, codeMirror.getValue());
        });

        // Init
        onChangeLiveEditReact(outputEl, codeMirrorInstance.getValue());
      })(i);
    }
  }

  // just render the component/s (no live editing)
  function setup() {
    const liveEditors = document.getElementsByClassName('react-live-editor');

    for (var i = 0; i < liveEditors.length; i++) {
      (function (index) {
        var editor = liveEditors[index];

        var outputEl = document.getElementsByClassName(editor.dataset.output)[0];

        // Init
        onChangeLiveEditReact(outputEl, editor.value);
      })(i);
    }
  }

  // start the rendering
  function onReactInitFn(isLiveEdit) {
    if (!!isLiveEdit) {
      setupLiveEdit();
    } else {
      setup();
    }
  }

  // we will call this from the view template to kick things off
  window.onReactInitFn = onReactInitFn;

  return {
    reactCompile: reactCompile
  };
}
