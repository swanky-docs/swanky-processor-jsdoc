'use strict';

/*
 * @dgService scriptTag
 * @description
 * This file reader will remove everything from the file except for the content inside <script> tags.
 * This is useful for Svelte components and VueJS that include HTML, CSS and JS in the one document.
 *
 * This is identical to the jsDocFileReader execept for the filtering that it does
 */
module.exports = function scriptTagFileReader(log, jsdocFileReader) {
  return {
    name: 'scriptTag',
    defaultPattern: /\.html$/,
    getDocs: function(fileInfo) {

      // Get all of the script content
      fileInfo.content = fileInfo.content
        .match(/<script>(.|\n)*?<\/script>/gmi)
        .map(item => item.replace(/<\/?script>/g, ''))      // Strip the <script></script> tags themselves
        .join('\n');

      return jsdocFileReader.getDocs(fileInfo);
    }
  };
};
