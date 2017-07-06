'use strict';

module.exports = function() {
  return {
    name: 'event',
    docProperty: 'name',        // Use the event value as the doc.name property (so everything works)
    transforms: function(doc, tag, value) {
      doc.docType = 'event';    // This must be set for the 'doclet' to be discovered by the memberDocs processor
      doc.eventType = doc.type.typeExpression;    // Only works when the 'type' tag has been processed
      return value;
    }
  };
};
