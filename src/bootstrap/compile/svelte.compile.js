'use strict';

// With Svelte LiveEdit, we are just changing the ARGUMENTS that are PASSED TO our component.
// We are NOT re-implementing the entire Svelte REPL tool.
// This is the simplest compiler possible. Nothing Svelte-specific exists.
// TODO: Should this replace js.compile.js as the default JS compiler?


module.exports = function(target, newContent) {
  target.textContent = ''; // Clear the existing content

  // Babel is defined in the React live-update template via an external script
  var result;

  try {
    // Babel preset
    result = Babel.transform(newContent, { presets: ['es2015'] });
  } catch (err) {
    // console.log(err);
  }

  // Strangely, Babel doesn't eval the code automatically
  if (result) {
    try {
      eval(result.code);
    } catch (err) {
      // console.log(err);
    }
  }
};
