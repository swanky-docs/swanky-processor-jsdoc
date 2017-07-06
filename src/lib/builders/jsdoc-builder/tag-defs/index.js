'use strict';

module.exports = [
  require('./area'),
  require('./event'),
  require('./example'),
  require('./method'),
  require('./module'),
  require('./this')
];

/*
  The API for a tag definition is:

  // DI constructor (argument is passed using dependency injection)
  module.exports = function(extractAccessTransform) {

    // Returns a configuration object
    return {
      name: String,     // Name of the tag. If no other properties, the 'value' of this tag is assumed to be any arguments passed
                        // when defining the tag. E.g. @class FooClass is converted to { name: 'class', value: 'FooClass'}

      required: boolean,  // Indicates whether the tag is mandatory or not. Not used often. @ngdoc is a required tag for Angular

      multi: boolean,     // Can this tag appear multiple times?

      docProperty: String,  // The property in the 'doc' object. By default, the name property is used as the name of the docProperty.
                            // E.g. The @param tag is mapped to doc['params'] by setting docProperty: 'params' (because it is a multi tag)

      // defaultFn(doc) is called when the source-document DOES NOT CONTAIN this tag.
      // It allows the tag to have a default value.
      defaultFn: function(doc) {
        if ( doc.docType === 'directive' || doc.docType === 'input' ) {
          return { element: true, attribute: true, cssClass: false, comment: false };
        }
      },

      // Can be a function or an array of functions that return the value for the tag. Or mutate the doc object in other ways
      // e.g: transforms: [ extractTypeTransform, extractNameTransform, wholeTagTransform ]
      transforms: function(doc, tag, value) {
        value = value || '';
        return {
          element: value.indexOf('E') !== -1,
          attribute: value.indexOf('A') !== -1,
          cssClass: value.indexOf('C') !== -1,
          comment: value.indexOf('M') !== -1
        };
      }
    };
 };
 */
