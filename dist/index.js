(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.docsSoap = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var docsId = exports.docsId = /id="docs\-internal\-guid/;

var styles = exports.styles = {
  BOLD: '700',
  ITALIC: 'italic',
  UNDERLINE: 'underline',
  STRIKETHROUGH: 'line-through',
  SUPERSCRIPT: 'super',
  SUBSCRIPT: 'sub'
};

var elements = exports.elements = {
  ANCHOR: 'a',
  BOLD: 'strong',
  ITALIC: 'em',
  UNDERLINE: 'u',
  STRIKETHROUGH: 'del',
  SUPERSCRIPT: 'sup',
  SUBSCRIPT: 'sub'
};

var headers = exports.headers = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _constants = require('./constants');

var _parseHTML = require('./parseHTML');

var _parseHTML2 = _interopRequireDefault(_parseHTML);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var wrapNodeAnchor = function wrapNodeAnchor(node, href) {
  var anchor = document.createElement(_constants.elements.ANCHOR);
  anchor.href = href;
  anchor.appendChild(node.cloneNode(true));
  return anchor;
};

var wrapNodeInline = function wrapNodeInline(node, style) {
  var el = document.createElement(style);
  el.appendChild(node.cloneNode(true));
  return el;
};

var wrapNode = function wrapNode(inner, result) {
  var newNode = result.cloneNode(true);
  if (!inner) {
    return newNode;
  }
  if (inner.style && inner.style.fontWeight === _constants.styles.BOLD) {
    newNode = wrapNodeInline(newNode, _constants.elements.BOLD);
  }
  if (inner.style && inner.style.fontStyle === _constants.styles.ITALIC) {
    newNode = wrapNodeInline(newNode, _constants.elements.ITALIC);
  }
  if (inner.style && inner.style.textDecoration === _constants.styles.UNDERLINE) {
    newNode = wrapNodeInline(newNode, _constants.elements.UNDERLINE);
  }
  if (inner.style && inner.style.textDecoration === _constants.styles.STRIKETHROUGH) {
    newNode = wrapNodeInline(newNode, _constants.elements.STRIKETHROUGH);
  }
  if (inner.style && inner.style.verticalAlign === _constants.styles.SUPERSCRIPT) {
    newNode = wrapNodeInline(newNode, _constants.elements.SUPERSCRIPT);
  }
  if (inner.style && inner.style.verticalAlign === _constants.styles.SUBSCRIPT) {
    newNode = wrapNodeInline(newNode, _constants.elements.SUBSCRIPT);
  }
  return newNode;
};

var applyBlockStyles = function applyBlockStyles(dirty) {
  var node = dirty.cloneNode(true);
  var newNode = document.createTextNode(node.textContent);
  var styledNode = document.createTextNode('');
  if (node.childNodes[0] && node.childNodes[0].style) {
    styledNode = node.childNodes[0];
  }
  if (node.childNodes[0] && node.childNodes[0].nodeName === 'A') {
    // flow-ignore Flow doesn't recognize that a childNode can be an HTMLAnchorElement
    newNode = wrapNodeAnchor(newNode.cloneNode(true), node.childNodes[0].href);
    styledNode = node.childNodes[0].childNodes[0];
  }
  newNode = wrapNode(styledNode, newNode);
  return newNode;
};

var applyInlineStyles = function applyInlineStyles(dirty) {
  var node = dirty.cloneNode(true);
  var newNode = document.createTextNode(node.textContent);
  var styledNode = node;
  if (node.nodeName === 'A') {
    // flow-ignore Flow doesn't recognize that cloneNode() can return an HTMLAnchorElement
    newNode = wrapNodeAnchor(newNode, node.href);
    if (node.childNodes[0] && node.childNodes[0].style) {
      styledNode = node.childNodes[0];
    }
  }
  newNode = wrapNode(styledNode, newNode);
  return newNode;
};

var getCleanNode = function getCleanNode(node) {
  if (node.childNodes && (node.childNodes.length <= 1 || node.nodeName === 'OL' || node.nodeName === 'UL')) {
    var _ret = function () {
      var newWrapper = null;
      var newNode = document.createTextNode(node.textContent);
      if (node.nodeName === 'UL' || node.nodeName === 'OL' || node.nodeName === 'LI') {
        newWrapper = document.createElement(node.nodeName);
        newNode = document.createDocumentFragment();
        var items = [];
        for (var i = 0; i < node.childNodes.length; i++) {
          items.push.apply(items, _toConsumableArray(getCleanNode(node.childNodes[i])));
        }
        items.map(function (i) {
          return newNode.appendChild(i);
        });
      } else if (_constants.headers.indexOf(node.nodeName) !== -1) {
        newWrapper = document.createElement(node.nodeName);
        newNode = applyInlineStyles(node.childNodes[0]);
      } else if (node.nodeName === 'P') {
        newWrapper = document.createElement('p');
        newNode = applyBlockStyles(node);
      } else if (node.nodeName === 'BR') {
        newNode = node;
      } else {
        newWrapper = document.createElement('span');
        newNode = applyInlineStyles(node);
      }
      if (newWrapper) {
        newWrapper.appendChild(newNode);
        return {
          v: [newWrapper]
        };
      }
      return {
        v: [node.cloneNode(true)]
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }
  if (node.childNodes) {
    var nodes = [];
    for (var i = 0; i < node.childNodes.length; i++) {
      nodes.push.apply(nodes, _toConsumableArray(getCleanNode(node.childNodes[i])));
    }
    return nodes;
  }
  return [node];
};

/**
 * parses the given "dirty" clipboard content and returns a (mostly) clean
 * HTML document with only the HTML content you want
 * @param dirty
 * @returns {HTMLElement}
 */
var getCleanDocument = function getCleanDocument(dirty) {
  // create a new document to preserve the integrity of the original data
  var body = document.createElement('body');
  var nodes = dirty.childNodes;
  var cleanNodes = [];

  // for each top level node, clean it up recursively
  for (var i = 0; i < nodes.length; i++) {
    cleanNodes.push.apply(cleanNodes, _toConsumableArray(getCleanNode(nodes[i])));
  }

  // append all of the clean nodes to the new document
  for (var _i = 0; _i < cleanNodes.length; _i++) {
    body.appendChild(cleanNodes[_i].cloneNode(true));
  }

  // all clean
  return body;
};

exports.default = function (clipboardContent) {
  if (typeof clipboardContent !== 'string') {
    throw new Error('Expected \'clipboardContent\' to be a string of HTML, received ' + (typeof clipboardContent === 'undefined' ? 'undefined' : _typeof(clipboardContent)));
  }
  if (clipboardContent.length <= 0) {
    throw new Error('Expected clipboardContent to have content, received empty string');
  }
  if (!clipboardContent.match(_constants.docsId)) {
    return (0, _parseHTML2.default)(clipboardContent.replace(/(\r\n|\n|\r)/, '')).outerHTML;
  }
  return getCleanDocument((0, _parseHTML2.default)(clipboardContent.replace(/(\r\n|\n|\r)/, ''))).outerHTML;
};

},{"./constants":1,"./parseHTML":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseHTML = exports.docsSoap = undefined;

var _docsSoap = require('./docsSoap');

var _docsSoap2 = _interopRequireDefault(_docsSoap);

var _parseHTML = require('./parseHTML');

var _parseHTML2 = _interopRequireDefault(_parseHTML);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _docsSoap2.default;
exports.docsSoap = _docsSoap2.default;
exports.parseHTML = _parseHTML2.default;

},{"./docsSoap":2,"./parseHTML":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (html) {
  var doc = void 0;
  if (typeof DOMParser !== 'undefined') {
    var parser = new DOMParser();
    doc = parser.parseFromString(html, 'text/html');
  } else {
    doc = document.implementation.createHTMLDocument('');
    doc.documentElement.innerHTML = html;
  }
  return doc.body;
};

},{}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uc3RhbnRzLmpzIiwic3JjL2RvY3NTb2FwLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL3BhcnNlSFRNTC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FDQU8sSUFBTSwwQkFBUywwQkFBZjs7QUFFQSxJQUFNLDBCQUFTO0FBQ3BCLFFBQU0sS0FEYztBQUVwQixVQUFRLFFBRlk7QUFHcEIsYUFBVyxXQUhTO0FBSXBCLGlCQUFlLGNBSks7QUFLcEIsZUFBYSxPQUxPO0FBTXBCLGFBQVc7QUFOUyxDQUFmOztBQVNBLElBQU0sOEJBQVc7QUFDdEIsVUFBUSxHQURjO0FBRXRCLFFBQU0sUUFGZ0I7QUFHdEIsVUFBUSxJQUhjO0FBSXRCLGFBQVcsR0FKVztBQUt0QixpQkFBZSxLQUxPO0FBTXRCLGVBQWEsS0FOUztBQU90QixhQUFXO0FBUFcsQ0FBakI7O0FBVUEsSUFBTSw0QkFBVSxDQUNyQixJQURxQixFQUVyQixJQUZxQixFQUdyQixJQUhxQixFQUlyQixJQUpxQixFQUtyQixJQUxxQixFQU1yQixJQU5xQixDQUFoQjs7Ozs7Ozs7Ozs7QUNuQlA7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxpQkFBaUIsU0FBakIsY0FBaUIsQ0FDckIsSUFEcUIsRUFFckIsSUFGcUIsRUFHQztBQUN0QixNQUFNLFNBQVMsU0FBUyxhQUFULENBQXVCLG9CQUFTLE1BQWhDLENBQWY7QUFDQSxTQUFPLElBQVAsR0FBYyxJQUFkO0FBQ0EsU0FBTyxXQUFQLENBQW1CLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBbkI7QUFDQSxTQUFPLE1BQVA7QUFDRCxDQVJEOztBQVVBLElBQU0saUJBQWlCLFNBQWpCLGNBQWlCLENBQ3JCLElBRHFCLEVBRXJCLEtBRnFCLEVBR1o7QUFDVCxNQUFNLEtBQUssU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQVg7QUFDQSxLQUFHLFdBQUgsQ0FBZSxLQUFL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QixJQUF2QixFQUE2QixXQUE3QixDQUFOO0FBQ0QsR0FIRCxNQUdPO0FBQ0wsVUFBTSxTQUFTLGNBQVQsQ0FBd0Isa0JBQXhCLENBQTJDLEVBQTNDLENBQU47QUFDQSxRQUFJLGVBQUosQ0FBb0IsU0FBcEIsR0FBZ0MsSUFBaEM7QUFDRDtBQUNELFNBQU8sSUFBSSxJQUFYO0FBQ0QsQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgY29uc3QgZG9jc0lkID0gL2lkPVwiZG9jc1xcLWludGVybmFsXFwtZ3VpZC87XG5cbmV4cG9ydCBjb25zdCBzdHlsZXMgPSB7XG4gIEJPTEQ6ICc3MDAnLFxuICBJVEFMSUM6ICdpdGFsaWMnLFxuICBVTkRFUkxJTkU6ICd1bmRlcmxpbmUnLFxuICBTVFJJS0VUSFJPVUdIOiAnbGluZS10aHJvdWdoJyxcbiAgU1VQRVJTQ1JJUFQ6ICdzdXBlcicsXG4gIFNVQlNDUklQVDogJ3N1Yidcbn07XG5cbmV4cG9ydCBjb25zdCBlbGVtZW50cyA9IHtcbiAgQU5DSE9SOiAnYScsXG4gIEJPTEQ6ICdzdHJvbmcnLFxuICBJVEFMSUM6ICdlbScsXG4gIFVOREVSTElORTogJ3UnLFxuICBTVFJJS0VUSFJPVUdIOiAnZGVsJyxcbiAgU1VQRVJTQ1JJUFQ6ICdzdXAnLFxuICBTVUJTQ1JJUFQ6ICdzdWInXG59O1xuXG5leHBvcnQgY29uc3QgaGVhZGVycyA9IFtcbiAgJ0gxJyxcbiAgJ0gyJyxcbiAgJ0gzJyxcbiAgJ0g0JyxcbiAgJ0g1JyxcbiAgJ0g2J1xuXTtcbiIsIi8vIEBmbG93XG5cbmltcG9ydCB7IGRvY3NJZCwgZWxlbWVudHMsIGhlYWRlcnMsIHN0eWxlcyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCBwYXJzZUhUTUwgZnJvbSAnLi9wYXJzZUhUTUwnO1xuXG5jb25zdCB3cmFwTm9kZUFuY2hvciA9IChcbiAgbm9kZTogTm9kZSxcbiAgaHJlZjogc3RyaW5nXG4pOiBIVE1MQW5jaG9yRWxlbWVudCA9PiB7XG4gIGNvbnN0IGFuY2hvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudHMuQU5DSE9SKTtcbiAgYW5jaG9yLmhyZWYgPSBocmVmO1xuICBhbmNob3IuYXBwZW5kQ2hpbGQobm9kZS5jbG9uZU5vZGUodHJ1ZSkpO1xuICByZXR1cm4gYW5jaG9yO1xufTtcblxuY29uc3Qgd3JhcE5vZGVJbmxpbmUgPSAoXG4gIG5vZGU6IE5vZGUsXG4gIHN0eWxlOiBzdHJpbmdcbik6IE5vZGUgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoc3R5bGUpO1xuICBlbC5hcHBlbmRDaGlsZChub2RlLmNsb25lTm9kZSh0cnVlKSk7XG4gIHJldHVybiBlbDtcbn07XG5cbmNvbnN0IHdyYXBOb2RlID0gKFxuICBpbm5lcjogTm9kZSxcbiAgcmVzdWx0OiBOb2RlXG4pOiBOb2RlID0+IHtcbiAgbGV0IG5ld05vZGUgPSByZXN1bHQuY2xvbmVOb2RlKHRydWUpO1xuICBpZiAoIWlubmVyKSB7XG4gICAgcmV0dXJuIG5ld05vZGU7XG4gIH1cbiAgaWYgKGlubmVyLnN0eWxlICYmIGlubmVyLnN0eWxlLmZvbnRXZWlnaHQgPT09IHN0eWxlcy5CT0xEKSB7XG4gICAgbmV3Tm9kZSA9IHdyYXBOb2RlSW5saW5lKG5ld05vZGUsIGVsZW1lbnRzLkJPTEQpO1xuICB9XG4gIGlmIChpbm5lci5zdHlsZSAmJiBpbm5lci5zdHlsZS5mb250U3R5bGUgPT09IHN0eWxlcy5JVEFMSUMpIHtcbiAgICBuZXdOb2RlID0gd3JhcE5vZGVJbmxpbmUobmV3Tm9kZSwgZWxlbWVudHMuSVRBTElDKTtcbiAgfVxuICBpZiAoaW5uZXIuc3R5bGUgJiYgaW5uZXIuc3R5bGUudGV4dERlY29yYXRpb24gPT09IHN0eWxlcy5VTkRFUkxJTkUpIHtcbiAgICBuZXdOb2RlID0gd3JhcE5vZGVJbmxpbmUobmV3Tm9kZSwgZWxlbWVudHMuVU5ERVJMSU5FKTtcbiAgfVxuICBpZiAoaW5uZXIuc3R5bGUgJiYgaW5uZXIuc3R5bGUudGV4dERlY29yYXRpb24gPT09IHN0eWxlcy5TVFJJS0VUSFJPVUdIKSB7XG4gICAgbmV3Tm9kZSA9IHdyYXBOb2RlSW5saW5lKG5ld05vZGUsIGVsZW1lbnRzLlNUUklLRVRIUk9VR0gpO1xuICB9XG4gIGlmIChpbm5lci5zdHlsZSAmJiBpbm5lci5zdHlsZS52ZXJ0aWNhbEFsaWduID09PSBzdHlsZXMuU1VQRVJTQ1JJUFQpIHtcbiAgICBuZXdOb2RlID0gd3JhcE5vZGVJbmxpbmUobmV3Tm9kZSwgZWxlbWVudHMuU1VQRVJTQ1JJUFQpO1xuICB9XG4gIGlmIChpbm5lci5zdHlsZSAmJiBpbm5lci5zdHlsZS52ZXJ0aWNhbEFsaWduID09PSBzdHlsZXMuU1VCU0NSSVBUKSB7XG4gICAgbmV3Tm9kZSA9IHdyYXBOb2RlSW5saW5lKG5ld05vZGUsIGVsZW1lbnRzLlNVQlNDUklQVCk7XG4gIH1cbiAgcmV0dXJuIG5ld05vZGU7XG59O1xuXG5jb25zdCBhcHBseUJsb2NrU3R5bGVzID0gKFxuICBkaXJ0eTogTm9kZVxuKTogTm9kZSA9PiB7XG4gIGNvbnN0IG5vZGUgPSBkaXJ0eS5jbG9uZU5vZGUodHJ1ZSk7XG4gIGxldCBuZXdOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobm9kZS50ZXh0Q29udGVudCk7XG4gIGxldCBzdHlsZWROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICBpZiAobm9kZS5jaGlsZE5vZGVzWzBdICYmIG5vZGUuY2hpbGROb2Rlc1swXS5zdHlsZSkge1xuICAgIHN0eWxlZE5vZGUgPSBub2RlLmNoaWxkTm9kZXNbMF07XG4gIH1cbiAgaWYgKG5vZGUuY2hpbGROb2Rlc1swXSAmJiBub2RlLmNoaWxkTm9kZXNbMF0ubm9kZU5hbWUgPT09ICdBJykge1xuICAgIC8vIGZsb3ctaWdub3JlIEZsb3cgZG9lc24ndCByZWNvZ25pemUgdGhhdCBhIGNoaWxkTm9kZSBjYW4gYmUgYW4gSFRNTEFuY2hvckVsZW1lbnRcbiAgICBuZXdOb2RlID0gd3JhcE5vZGVBbmNob3IobmV3Tm9kZS5jbG9uZU5vZGUodHJ1ZSksIG5vZGUuY2hpbGROb2Rlc1swXS5ocmVmKTtcbiAgICBzdHlsZWROb2RlID0gbm9kZS5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF07XG4gIH1cbiAgbmV3Tm9kZSA9IHdyYXBOb2RlKHN0eWxlZE5vZGUsIG5ld05vZGUpO1xuICByZXR1cm4gbmV3Tm9kZTtcbn07XG5cbmNvbnN0IGFwcGx5SW5saW5lU3R5bGVzID0gKFxuICBkaXJ0eTogTm9kZVxuKTogTm9kZSA9PiB7XG4gIGNvbnN0IG5vZGUgPSBkaXJ0eS5jbG9uZU5vZGUodHJ1ZSk7XG4gIGxldCBuZXdOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobm9kZS50ZXh0Q29udGVudCk7XG4gIGxldCBzdHlsZWROb2RlID0gbm9kZTtcbiAgaWYgKG5vZGUubm9kZU5hbWUgPT09ICdBJykge1xuICAgIC8vIGZsb3ctaWdub3JlIEZsb3cgZG9lc24ndCByZWNvZ25pemUgdGhhdCBjbG9uZU5vZGUoKSBjYW4gcmV0dXJuIGFuIEhUTUxBbmNob3JFbGVtZW50XG4gICAgbmV3Tm9kZSA9IHdyYXBOb2RlQW5jaG9yKG5ld05vZGUsIG5vZGUuaHJlZik7XG4gICAgaWYgKG5vZGUuY2hpbGROb2Rlc1swXSAmJiBub2RlLmNoaWxkTm9kZXNbMF0uc3R5bGUpIHtcbiAgICAgIHN0eWxlZE5vZGUgPSBub2RlLmNoaWxkTm9kZXNbMF07XG4gICAgfVxuICB9XG4gIG5ld05vZGUgPSB3cmFwTm9kZShzdHlsZWROb2RlLCBuZXdOb2RlKTtcbiAgcmV0dXJuIG5ld05vZGU7XG59O1xuXG5jb25zdCBnZXRDbGVhbk5vZGUgPSAoXG4gIG5vZGU6IE5vZGVcbik6IEFycmF5PE5vZGU+ID0+IHtcbiAgaWYgKG5vZGUuY2hpbGROb2RlcyAmJiAobm9kZS5jaGlsZE5vZGVzLmxlbmd0aCA8PSAxIHx8IG5vZGUubm9kZU5hbWUgPT09ICdPTCcgfHwgbm9kZS5ub2RlTmFtZSA9PT0gJ1VMJykpIHtcbiAgICBsZXQgbmV3V3JhcHBlciA9IG51bGw7XG4gICAgbGV0IG5ld05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShub2RlLnRleHRDb250ZW50KTtcbiAgICBpZiAobm9kZS5ub2RlTmFtZSA9PT0gJ1VMJyB8fCBub2RlLm5vZGVOYW1lID09PSAnT0wnIHx8IG5vZGUubm9kZU5hbWUgPT09ICdMSScpIHtcbiAgICAgIG5ld1dyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGUubm9kZU5hbWUpO1xuICAgICAgbmV3Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVtcy5wdXNoKC4uLmdldENsZWFuTm9kZShub2RlLmNoaWxkTm9kZXNbaV0pKTtcbiAgICAgIH1cbiAgICAgIGl0ZW1zLm1hcCgoaTogTm9kZSk6IE5vZGUgPT4gbmV3Tm9kZS5hcHBlbmRDaGlsZChpKSk7XG4gICAgfSBlbHNlIGlmIChoZWFkZXJzLmluZGV4T2Yobm9kZS5ub2RlTmFtZSkgIT09IC0xKSB7XG4gICAgICBuZXdXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlLm5vZGVOYW1lKTtcbiAgICAgIG5ld05vZGUgPSBhcHBseUlubGluZVN0eWxlcyhub2RlLmNoaWxkTm9kZXNbMF0pO1xuICAgIH0gZWxzZSBpZiAobm9kZS5ub2RlTmFtZSA9PT0gJ1AnKSB7XG4gICAgICBuZXdXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgbmV3Tm9kZSA9IGFwcGx5QmxvY2tTdHlsZXMobm9kZSk7XG4gICAgfSBlbHNlIGlmIChub2RlLm5vZGVOYW1lID09PSAnQlInKSB7XG4gICAgICBuZXdOb2RlID0gbm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3V3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIG5ld05vZGUgPSBhcHBseUlubGluZVN0eWxlcyhub2RlKTtcbiAgICB9XG4gICAgaWYgKG5ld1dyYXBwZXIpIHtcbiAgICAgIG5ld1dyYXBwZXIuYXBwZW5kQ2hpbGQobmV3Tm9kZSk7XG4gICAgICByZXR1cm4gW25ld1dyYXBwZXJdO1xuICAgIH1cbiAgICByZXR1cm4gW25vZGUuY2xvbmVOb2RlKHRydWUpXTtcbiAgfVxuICBpZiAobm9kZS5jaGlsZE5vZGVzKSB7XG4gICAgY29uc3Qgbm9kZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbm9kZXMucHVzaCguLi5nZXRDbGVhbk5vZGUobm9kZS5jaGlsZE5vZGVzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBub2RlcztcbiAgfVxuICByZXR1cm4gW25vZGVdO1xufTtcblxuLyoqXG4gKiBwYXJzZXMgdGhlIGdpdmVuIFwiZGlydHlcIiBjbGlwYm9hcmQgY29udGVudCBhbmQgcmV0dXJucyBhIChtb3N0bHkpIGNsZWFuXG4gKiBIVE1MIGRvY3VtZW50IHdpdGggb25seSB0aGUgSFRNTCBjb250ZW50IHlvdSB3YW50XG4gKiBAcGFyYW0gZGlydHlcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH1cbiAqL1xuY29uc3QgZ2V0Q2xlYW5Eb2N1bWVudCA9IChcbiAgZGlydHk6IEhUTUxFbGVtZW50XG4pOiBIVE1MRWxlbWVudCA9PiB7XG4gIC8vIGNyZWF0ZSBhIG5ldyBkb2N1bWVudCB0byBwcmVzZXJ2ZSB0aGUgaW50ZWdyaXR5IG9mIHRoZSBvcmlnaW5hbCBkYXRhXG4gIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdib2R5Jyk7XG4gIGNvbnN0IG5vZGVzID0gZGlydHkuY2hpbGROb2RlcztcbiAgY29uc3QgY2xlYW5Ob2RlcyA9IFtdO1xuXG4gIC8vIGZvciBlYWNoIHRvcCBsZXZlbCBub2RlLCBjbGVhbiBpdCB1cCByZWN1cnNpdmVseVxuICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2xlYW5Ob2Rlcy5wdXNoKC4uLmdldENsZWFuTm9kZShub2Rlc1tpXSkpO1xuICB9XG5cbiAgLy8gYXBwZW5kIGFsbCBvZiB0aGUgY2xlYW4gbm9kZXMgdG8gdGhlIG5ldyBkb2N1bWVudFxuICBmb3IgKGxldCBpID0gMDsgaSA8IGNsZWFuTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICBib2R5LmFwcGVuZENoaWxkKGNsZWFuTm9kZXNbaV0uY2xvbmVOb2RlKHRydWUpKTtcbiAgfVxuXG4gIC8vIGFsbCBjbGVhblxuICByZXR1cm4gYm9keTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IChcbiAgY2xpcGJvYXJkQ29udGVudDogc3RyaW5nXG4pOiBzdHJpbmcgPT4ge1xuICBpZiAodHlwZW9mIGNsaXBib2FyZENvbnRlbnQgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCAnY2xpcGJvYXJkQ29udGVudCcgdG8gYmUgYSBzdHJpbmcgb2YgSFRNTCwgcmVjZWl2ZWQgJHt0eXBlb2YgY2xpcGJvYXJkQ29udGVudH1gKTtcbiAgfVxuICBpZiAoY2xpcGJvYXJkQ29udGVudC5sZW5ndGggPD0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgY2xpcGJvYXJkQ29udGVudCB0byBoYXZlIGNvbnRlbnQsIHJlY2VpdmVkIGVtcHR5IHN0cmluZycpO1xuICB9XG4gIGlmICghY2xpcGJvYXJkQ29udGVudC5tYXRjaChkb2NzSWQpKSB7XG4gICAgcmV0dXJuIHBhcnNlSFRNTChjbGlwYm9hcmRDb250ZW50LnJlcGxhY2UoLyhcXHJcXG58XFxufFxccikvLCAnJykpLm91dGVySFRNTDtcbiAgfVxuICByZXR1cm4gZ2V0Q2xlYW5Eb2N1bWVudChwYXJzZUhUTUwoY2xpcGJvYXJkQ29udGVudC5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpLywgJycpKSkub3V0ZXJIVE1MO1xufTtcbiIsIi8vIEBmbG93XG5cbmltcG9ydCBkb2NzU29hcCBmcm9tICcuL2RvY3NTb2FwJztcbmltcG9ydCBwYXJzZUhUTUwgZnJvbSAnLi9wYXJzZUhUTUwnO1xuXG5leHBvcnQgZGVmYXVsdCBkb2NzU29hcDtcblxuZXhwb3J0IHtcbiAgZG9jc1NvYXAsXG4gIHBhcnNlSFRNTFxufTtcbiIsIi8vIEBmbG93XG5cbmV4cG9ydCBkZWZhdWx0IChcbiAgaHRtbDogc3RyaW5nXG4pOiBIVE1MRWxlbWVudCA9PiB7XG4gIGxldCBkb2MgPSB2b2lkIDA7XG4gIGlmICh0eXBlb2YgRE9NUGFyc2VyICE9PSAndW5kZWZpbmVkJykge1xuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgICBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGh0bWwsICd0ZXh0L2h0bWwnKTtcbiAgfSBlbHNlIHtcbiAgICBkb2MgPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoJycpO1xuICAgIGRvYy5kb2N1bWVudEVsZW1lbnQuaW5uZXJIVE1MID0gaHRtbDtcbiAgfVxuICByZXR1cm4gZG9jLmJvZHk7XG59O1xuIl19
