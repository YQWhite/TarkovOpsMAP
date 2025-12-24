import { getDistanceList } from './basic.mjs';

function collectLine(target, points) {
  const list = target.getCoords();
  list.push(target.getCenterPoint());
  const margin = this.margin / this.canvas.getZoom();
  const opts = {
    target,
    list,
    points,
    margin
  };
  const vLines = collectPoints({
    ...opts,
    type: 'x'
  });
  const hLines = collectPoints({
    ...opts,
    type: 'y'
  });
  return {
    vLines,
    hLines
  };
}
const originArr = [['left', 'top'], ['right', 'top'], ['right', 'bottom'], ['left', 'bottom'], ['center', 'center']];
function collectPoints(props) {
  const {
    target,
    list,
    points,
    margin,
    type
  } = props;
  const res = [];
  const arr = [];
  let min = Infinity;
  for (const item of list) {
    const o = getDistanceList(item, points, type);
    arr.push(o);
    if (min > o.dis) min = o.dis;
  }
  if (min > margin) return res;
  let b = false;
  for (let i = 0; i < list.length; i++) {
    if (arr[i].dis != min) continue;
    for (const item of arr[i].arr) {
      res.push({
        origin: list[i],
        target: item
      });
    }
    if (b) continue;
    b = true;
    const d = arr[i].arr[0][type] - list[i][type];
    // It will change the original data, and the next time we collect y, use the modified data.
    list.forEach(item => {
      item[type] += d;
    });
    target.setXY(list[i], ...originArr[i]);
    target.setCoords();
  }
  return res;
}

export { collectLine };
//# sourceMappingURL=collect-line.mjs.map
