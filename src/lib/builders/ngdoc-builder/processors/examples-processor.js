'use strict';

const path = require('path');
const fs = require('fs');

module.exports = function myDocProcessor() { // dependency1, dependency2
  return {
    $process: function(docs) {
      return docs.map(function(doc) {
        const basePath = path.dirname(doc.fileInfo.filePath);

        if (doc.examples) {
          doc.examples = doc.examples.map(function(example) {
            if (path.extname(example) === '.html') {
              const filePath = path.resolve(basePath, example);

              if (fs.existsSync(filePath)) {
                return fs.readFileSync(filePath, 'utf-8');
              } else {
                return filePath;
              }
            } else {
              return example;
            }
          });
        }

        return doc;
      });
    },
    $runBefore: ['paths-computed']
  };
};