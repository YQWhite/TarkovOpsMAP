const cloneStyles = style => {
  const newObj = {};
  Object.keys(style).forEach(key => {
    newObj[key] = {};
    Object.keys(style[key]).forEach(keyInner => {
      newObj[key][keyInner] = {
        ...style[key][keyInner]
      };
    });
  });
  return newObj;
};

export { cloneStyles };
//# sourceMappingURL=cloneStyles.mjs.map
