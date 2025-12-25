import { defineProperty as _defineProperty } from '../../../_virtual/_rollupPluginBabelHelpers.mjs';
import { getFabricDocument, getEnv } from '../../env/index.mjs';
import { createCanvasElement } from '../../util/misc/dom.mjs';
import { setStyle } from '../../util/internals/dom_style.mjs';
import { makeElementUnselectable, setCanvasDimensions, setCSSDimensions } from './util.mjs';
import { StaticCanvasDOMManager } from './StaticCanvasDOMManager.mjs';
import { NONE } from '../../constants.mjs';

class CanvasDOMManager extends StaticCanvasDOMManager {
  constructor(arg0) {
    let {
      allowTouchScrolling = false,
      containerClass = ''
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super(arg0);
    _defineProperty(this, "upper", void 0);
    _defineProperty(this, "container", void 0);
    const {
      el: lowerCanvasEl
    } = this.lower;
    const upperCanvasEl = this.createUpperCanvas();
    this.upper = {
      el: upperCanvasEl,
      ctx: upperCanvasEl.getContext('2d')
    };
    this.applyCanvasStyle(lowerCanvasEl, {
      allowTouchScrolling
    });
    this.applyCanvasStyle(upperCanvasEl, {
      allowTouchScrolling,
      styles: {
        position: 'absolute',
        left: '0',
        top: '0'
      }
    });
    const container = this.createContainerElement();
    container.classList.add(containerClass);
    if (lowerCanvasEl.parentNode) {
      lowerCanvasEl.parentNode.replaceChild(container, lowerCanvasEl);
    }
    container.append(lowerCanvasEl, upperCanvasEl);
    this.container = container;
  }
  createUpperCanvas() {
    const {
      el: lowerCanvasEl
    } = this.lower;
    const el = createCanvasElement();
    // we assign the same classname of the lowerCanvas
    el.className = lowerCanvasEl.className;
    // but then we remove the lower-canvas specific className
    el.classList.remove('lower-canvas');
    // we add the specific upper-canvas class
    el.classList.add('upper-canvas');
    el.setAttribute('data-fabric', 'top');
    el.style.cssText = lowerCanvasEl.style.cssText;
    el.setAttribute('draggable', 'true');
    return el;
  }
  createContainerElement() {
    const container = getFabricDocument().createElement('div');
    container.setAttribute('data-fabric', 'wrapper');
    setStyle(container, {
      position: 'relative'
    });
    makeElementUnselectable(container);
    return container;
  }

  /**
   * @private
   * @param {HTMLCanvasElement} element canvas element to apply styles on
   */
  applyCanvasStyle(element, options) {
    const {
      styles,
      allowTouchScrolling
    } = options;
    setStyle(element, {
      ...styles,
      'touch-action': allowTouchScrolling ? 'manipulation' : NONE
    });
    makeElementUnselectable(element);
  }
  setDimensions(size, retinaScaling) {
    super.setDimensions(size, retinaScaling);
    const {
      el,
      ctx
    } = this.upper;
    setCanvasDimensions(el, ctx, size, retinaScaling);
  }
  setCSSDimensions(size) {
    super.setCSSDimensions(size);
    setCSSDimensions(this.upper.el, size);
    setCSSDimensions(this.container, size);
  }
  cleanupDOM(size) {
    const container = this.container,
      {
        el: lowerCanvasEl
      } = this.lower,
      {
        el: upperCanvasEl
      } = this.upper;
    super.cleanupDOM(size);
    container.removeChild(upperCanvasEl);
    container.removeChild(lowerCanvasEl);
    if (container.parentNode) {
      container.parentNode.replaceChild(lowerCanvasEl, container);
    }
  }
  dispose() {
    super.dispose();
    getEnv().dispose(this.upper.el);
    // @ts-expect-error disposing
    delete this.upper;
    // @ts-expect-error disposing
    delete this.container;
  }
}

export { CanvasDOMManager };
//# sourceMappingURL=CanvasDOMManager.mjs.map
