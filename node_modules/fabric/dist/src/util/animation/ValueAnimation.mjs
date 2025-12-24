import { AnimationBase } from './AnimationBase.mjs';

class ValueAnimation extends AnimationBase {
  constructor(_ref) {
    let {
      startValue = 0,
      endValue = 100,
      ...otherOptions
    } = _ref;
    super({
      ...otherOptions,
      startValue,
      byValue: endValue - startValue
    });
  }
  calculate(timeElapsed) {
    const value = this.easing(timeElapsed, this.startValue, this.byValue, this.duration);
    return {
      value,
      valueProgress: Math.abs((value - this.startValue) / this.byValue)
    };
  }
}

export { ValueAnimation };
//# sourceMappingURL=ValueAnimation.mjs.map
