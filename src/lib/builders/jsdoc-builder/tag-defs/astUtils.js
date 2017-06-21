'use strict';

const _ = require('lodash');

module.exports = {
  setMethodPropertiesFromAST,
  setMethodPropertiesFromJSDocAndAST
};

function nodeHasParent(name = '') {
  return name.indexOf('#') > 0;
}


function getIdentifier(arrayOfCodeNodes, parentKey = 'id') {
  let objWithId = _.find(arrayOfCodeNodes, {[parentKey]: {type: 'Identifier'}});

  if (objWithId) {
    return objWithId[parentKey].name;
  }
  return '';
}


function getFullNodeName(doc) {
  let parentName = getIdentifier(doc.codeAncestors || []);
  let instanceName = getIdentifier([doc.codeNode], 'key') || getIdentifier([doc.codeNode]);

  if (parentName && instanceName) {
    return parentName + '#' + instanceName;
  } else if (instanceName) {
    return instanceName;
  }
  return; // undefined
}


function setMethodPropertiesFromAST(doc) {
  // If this node does NOT have a kind OR method OR function specified, AND codeNode.kind == 'method'
  // Output: doc.name
  if (!doc.codeNode || doc.codeNode.type !== 'MethodDefinition') {
    return;
  }

  // If this comment-block does not have a name, try to derive one from the parent module + method/function name
  if (!doc.name && !(doc.method || doc['function'])) {
    doc.name = getFullNodeName(doc);
  }

  if (nodeHasParent(doc.name)) {
    doc.docType = 'method';
    doc.method = doc.name;
  }
}



function setMethodPropertiesFromJSDocAndAST(doc, tag, value) {
  // Order of predence for finding the name: value, @name tag (doc.name), AST code
  // Check the name of the document. If it contains a '#', it is actually a method. Set the docType to 'method'.
  let name = value || doc.name || getFullNodeName(doc);

  if (nodeHasParent(name)) {
    doc.docType = 'method';
  }

  // If there isn't a @name tag (because the user wrote @function/@method full#name), use the value instead
  if (!doc.name && name) {
    doc.name = name;
  }
  return name;
}
