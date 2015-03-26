/*
Hilbert curve generator. Non-recursive.
*/
var hilbert = (function() {
  // From Mike Bostock: http://bl.ocks.org/597287
  // Adapted from Nick Johnson: http://bit.ly/biWkkq
  var pairs = [
    [[0, 3], [1, 0], [3, 1], [2, 0]],
    [[2, 1], [1, 1], [3, 0], [0, 2]],
    [[2, 2], [3, 3], [1, 2], [0, 1]],
    [[0, 0], [3, 2], [1, 3], [2, 3]]
  ];
  // d2xy and rot are from:
  // http://en.wikipedia.org/wiki/Hilbert_curve#Applications_and_mapping_algorithms
  function rot(n, x, y, rx, ry) {
    if (ry === 0) {
      if (rx === 1) {
        x = n - 1 - x;
        y = n - 1 - y;
      }
      return [y, x];
    }
    return [x, y];
  }
  return {
    xy2d: function(x, y, z) {
      var quad = 0,
          pair,
          i = 0;
      while (--z >= 0) {
        pair = pairs[quad][(x & (1 << z) ? 2 : 0) | (y & (1 << z) ? 1 : 0)];
        i = (i << 2) | pair[0];
        quad = pair[1];
      }
      return i;
    },
    d2xy: function(z, t) {
      var n = 1 << z,
          x = 0,
          y = 0;
      for (var s = 1; s < n; s *= 2) {
        var rx = 1 & (t / 2),
            ry = 1 & (t ^ rx);
        var xy = rot(s, x, y, rx, ry);
        x = xy[0] + s * rx;
        y = xy[1] + s * ry;
        t /= 4;
      }
      return [x, y];
    }
  };
})();

function hilbertCurve(level) {
  list = [];
        for(var d=0; d < (1 << level*2); d++) {
            list.push (hilbert.d2xy(level, d));
        }
        return list;
}

list =hilbertCurve(6);
console.log(list.length);
//console.log(list);

var Canvas = require('canvas')
  , fs = require('fs');

var canvas = new Canvas(500, 500, 'png');
var ctx = canvas.getContext('2d');
var scale = 6;
ctx.lineWidth = 0.02;
ctx.scale(scale, scale);
ctx.translate(canvas.width/2/scale/4, canvas.height/2/scale/4);
ctx.beginPath();
ctx.moveTo(0, 0);
for(p in list){
    ctx.lineTo(list[p][0], list[p][1]);    
}
ctx.rect(list[31][0], list[31][1], 0.2, 0.2);
ctx.stroke();
fs.writeFileSync('hilbert1.png', canvas.toBuffer());