import { DEFAULT_SVG_FONT_SIZE } from '../constants.mjs';
import { parseUnit } from '../util/misc/svgParsing.mjs';
import { svgValidParentsRegEx, cPath, fSize } from './constants.mjs';
import { getGlobalStylesForElement } from './getGlobalStylesForElement.mjs';
import { normalizeAttr } from './normalizeAttr.mjs';
import { normalizeValue } from './normalizeValue.mjs';
import { parseFontDeclaration } from './parseFontDeclaration.mjs';
import { parseStyleAttribute } from './parseStyleAttribute.mjs';
import { setStrokeFillOpacity } from './setStrokeFillOpacity.mjs';

/**
 * Returns an object of attributes' name/value, given element and an array of attribute names;
 * Parses parent "g" nodes recursively upwards.
 * @param {SVGElement | HTMLElement} element Element to parse
 * @param {Array} attributes Array of attributes to parse
 * @return {Object} object containing parsed attributes' names/values
 */
function parseAttributes(element, attributes, cssRules) {
  if (!element) {
    return {};
  }
  let parentAttributes = {},
    fontSize,
    parentFontSize = DEFAULT_SVG_FONT_SIZE;

  // if there's a parent container (`g` or `a` or `symbol` node), parse its attributes recursively upwards
  if (element.parentNode && svgValidParentsRegEx.test(element.parentNode.nodeName)) {
    parentAttributes = parseAttributes(element.parentElement, attributes, cssRules);
    if (parentAttributes.fontSize) {
      fontSize = parentFontSize = parseUnit(parentAttributes.fontSize);
    }
  }
  const ownAttributes = {
    ...attributes.reduce((memo, attr) => {
      const value = element.getAttribute(attr);
      if (value) {
        memo[attr] = value;
      }
      return memo;
    }, {}),
    // add values parsed from style, which take precedence over attributes
    // (see: http://www.w3.org/TR/SVG/styling.html#UsingPresentationAttributes)
    ...getGlobalStylesForElement(element, cssRules),
    ...parseStyleAttribute(element)
  };
  if (ownAttributes[cPath]) {
    element.setAttribute(cPath, ownAttributes[cPath]);
  }
  if (ownAttributes[fSize]) {
    // looks like the minimum should be 9px when dealing with ems. this is what looks like in browsers.
    fontSize = parseUnit(ownAttributes[fSize], parentFontSize);
    ownAttributes[fSize] = `${fontSize}`;
  }

  // this should have its own complex type
  const normalizedStyle = {};
  for (const attr in ownAttributes) {
    const normalizedAttr = normalizeAttr(attr);
    const normalizedValue = normalizeValue(normalizedAttr, ownAttributes[attr], parentAttributes, fontSize);
    normalizedStyle[normalizedAttr] = normalizedValue;
  }
  if (normalizedStyle && normalizedStyle.font) {
    parseFontDeclaration(normalizedStyle.font, normalizedStyle);
  }
  const mergedAttrs = {
    ...parentAttributes,
    ...normalizedStyle
  };
  return svgValidParentsRegEx.test(element.nodeName) ? mergedAttrs : setStrokeFillOpacity(mergedAttrs);
}

export { parseAttributes };
//# sourceMappingURL=parseAttributes.mjs.map
