'use strict';

// When we get a "@module foo" tag, set the "kind" to 'module', and return the
module.exports = function() {
  return {
    name: 'module',
    transforms: function(doc, tag, value) {
      doc.kind = 'module';
      return value;
    }
  };
};
