import{reNum as e}from"../../parser/constants.min.mjs";import{normalizeWs as r}from"./normalizeWhiteSpace.min.mjs";const m=new RegExp(`(${e})`,"gi"),i=e=>r(e.replace(m," $1 ").replace(/,/gi," "));export{i as cleanupSvgAttribute};
//# sourceMappingURL=cleanupSvgAttribute.min.mjs.map
