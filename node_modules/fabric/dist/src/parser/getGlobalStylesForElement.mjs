import { elementMatchesRule } from './elementMatchesRule.mjs';

/**
 * @private
 */

function getGlobalStylesForElement(element) {
  let cssRules = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let styles = {};
  for (const rule in cssRules) {
    if (elementMatchesRule(element, rule.split(' '))) {
      styles = {
        ...styles,
        ...cssRules[rule]
      };
    }
  }
  return styles;
}

export { getGlobalStylesForElement };
//# sourceMappingURL=getGlobalStylesForElement.mjs.map
