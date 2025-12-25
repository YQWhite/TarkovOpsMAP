import{AnimationBase as t}from"./AnimationBase.min.mjs";class a extends t{constructor(t){let{startValue:a=0,endValue:s=100,...e}=t;super({...e,startValue:a,byValue:s-a})}calculate(t){const a=this.easing(t,this.startValue,this.byValue,this.duration);return{value:a,valueProgress:Math.abs((a-this.startValue)/this.byValue)}}}export{a as ValueAnimation};
//# sourceMappingURL=ValueAnimation.min.mjs.map
