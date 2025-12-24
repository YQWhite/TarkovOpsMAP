const r=function(r){for(var s=arguments.length,t=new Array(s>1?s-1:0),n=1;n<s;n++)t[n-1]=arguments[n];return console[r]("fabric",...t)};class s extends Error{constructor(r,s){super(`fabric: ${r}`,s)}}class t extends s{constructor(r){super(`${r} 'options.signal' is in 'aborted' state`)}}export{s as FabricError,t as SignalAbortedError,r as log};
//# sourceMappingURL=console.min.mjs.map
