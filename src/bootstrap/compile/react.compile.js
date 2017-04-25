'use strict';

module.exports = function(element, newContent) {
  element.textContent = ''; // Clear the existing content

  // Babel is defined in the React live-update template via an external script
  var result;

  try {
    // babel preset react should be imported by leaf module
    result = Babel.transform('_secretReactRenderMethod(' + newContent + ', element);', { presets: ['es2015', 'react'] });
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
