'use strict';

// Code Editor
const CodeMirror = require('codemirror/lib/codemirror');
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/lib/codemirror.css');
require('codemirror/mode/javascript/javascript.js');

// framework specific compile functions
const compile = {
  js: require('./compile/js.compile'),
  angular: require('./compile/angular.compile'),
  react: require('./compile/react.compile')
};

module.exports = (function() {

  // setup code mirror instances for live editing
  function setupLiveEdit(exampleId, compileFn) {
    const liveEditor = document.getElementById(exampleId);

    const codeMirrorInstance = CodeMirror.fromTextArea(liveEditor, {
      lineNumbers: true,
      lineWrapping: true,
      mode: {
        name: "htmlmixed",
        highlightFormatting: true
      },
      theme: 'swanky'
    });

    const outputEl = document.getElementsByClassName(liveEditor.dataset.output)[0];

    codeMirrorInstance.on('change', function (codeMirror) {
      onChangeLiveEdit(outputEl, codeMirror.getValue(), compileFn);
    });

    // Init
    onChangeLiveEdit(outputEl, codeMirrorInstance.getValue(), compileFn);
  }

  // just render the component/s (no live editing)
  function setup(exampleId, compileFn) {
    const editor = document.getElementById(exampleId);

    const outputEl = document.getElementsByClassName(editor.dataset.output)[0];

    // Init
    onChangeLiveEdit(outputEl, editor.value, compileFn);
  }

  function onChangeLiveEdit(element, value, compileFn) {
    compileFn(element, value);
  }

  // start the rendering
  function onInitFn(exampleId, isLiveEdit, framework) {
    const compileFn = compile[framework];

    if (isLiveEdit) {
      setupLiveEdit(exampleId, compileFn);
    } else {
      setup(exampleId, compileFn);
    }
  }

  // We will call this from the view template to kick things off
  window.onInitFn = onInitFn;

  return {
    onInitFn: onInitFn
  }
})();
