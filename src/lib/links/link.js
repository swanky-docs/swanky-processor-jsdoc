'use strict';

var INLINE_LINK = /(\S+)(?:\s+([\s\S]+))?/;

/*
 * @dgService linkInlineTagDef
 * @description
 * Process inline link tags (of the form {@link some/uri Some Title}), replacing them with HTML anchors, except when they are already HTML links
 * @kind function
 */
module.exports = function linkInlineTagDef(getLinkInfo, createDocMessage, log) {
  return {
    name: 'link',
    description: 'Process inline link tags (of the form {@link some/uri Some Title}), replacing them with HTML anchors',
    handler: function(doc, tagName, tagDescription) {

      if (tagDescription.indexOf('<a ') === 0) {
        tagDescription = tagDescription.replace(/(<([^>]+)>)/ig, '');
      }

      // Parse out the uri and title
      return tagDescription.replace(INLINE_LINK, function(match, uri, title) {

        var linkInfo = getLinkInfo(uri, title, doc);

        if (!linkInfo.valid) {
          log.warn(createDocMessage(linkInfo.error, doc));
        }

        return '<a href="' + linkInfo.url + '">' + linkInfo.title + '</a>';
      });
    }
  };
};
