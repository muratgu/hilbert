/*
Hilbert curve generator. Non-recursive.
ref: http://en.wikipedia.org/wiki/Hilbert_curve#Applications_and_mapping_algorithms  
*/
var Hilbert = (function() {
    var _rot = function (n, x, y, rx, ry) {
        if (ry === 0) {
            if (rx === 1) {
                x = n - 1 - x;
                y = n - 1 - y;
            }
            return [y, x];            
        }
        return [x, y];
    }

    var gen = function(level) {
        /*
        Generates a list of hilbert curve tuples
        for a 2D space in given size.

        Params:
            level (int): level of iteration.
                the size of the grid will be
                2**level.

        Returns:
            list of x,y coordinate tuples
        */
        list = [];
        for(var d=0; d < (1 << level*2); d++) {
            list.push (d2xy(level, d));
        }
        return list;
    }

    var xy2d = function (level, p) {
        /*
        Calculates the 1D distance of a point
        to the origin on a 2D hilbert curve.

        Params:
            level (int): level of iteration.
                the size of the grid will be
                2**level.
            p [(int), (int)]: xy coordinate

        Returns:
            (int): distance to origin

        */
        d = 0;
        n = 1 << level;
        s = n / 2;
        while (s > 0) {
            rx = ((p[0] & s) > 0) ? 1 : 0;
            ry = ((p[1] & s) > 0) ? 1 : 0;
            d += s * s * ((3 * rx) ^ ry);            
            p = _rot(s, p[0], p[1], rx, ry);
            s = s / 2;
        }
        return d;
    }

    var d2xy = function (level, d) {
        /*
        Calculates the coordinate of a point
        on 2D hilbert curve which is a distance
        away from the origin.

        Params:
            level (int): level of iteration.
                the size of the grid will be
                2**level.
            d (int): distance to the origin

        Returns:
            {x(int), y(int)}: xy coordinate

        */        
        n = 1 << level;
        s = 1;
        p = [0, 0];
        while (s < n) {
            rx = 1 & (d / 2);
            ry = 1 & (d ^ rx);
            p = _rot(s, p[0], p[1], rx, ry);
            p[0] += s * rx;
            p[1] += s * ry;
            d /= 4;
            s *= 2;
        }
        return p;
    }

    var test = function (level){
        /*
        Tests the algorithm for a given level
        */
        console.log('Testing for level ' + level);
        list = Hilbert.gen(level);
        console.log('Generated ' + list.length + ' points.');
        var i = 0;
        for(p in list){    
            var d = Hilbert.xy2d(6, list[p]);
            if (d !== i){
                console.log('Failed at point ' + i + ' giving ' + d);
                break;
            }
            i += 1;
        }
        if (i == list.length) {
            console.log('Passed');
        }
    }
    return {
        gen: gen,
        xy2d: xy2d,
        d2xy: d2xy,
        test: test
    }
})();

var level = 6;
var list = Hilbert.gen(level);

var Canvas = require('canvas')
  , fs = require('fs');

var canvas = new Canvas(1000, 1000, 'png');
var ctx = canvas.getContext('2d');
var scale = 16;
ctx.lineWidth = 0.01;
ctx.scale(scale, scale);
//ctx.translate(10, 0);
//ctx.translate(canvas.width/(2*scale*level*32), canvas.height/2/scale/level/32);
ctx.beginPath();
ctx.moveTo(0, 0);
for(p in list){
    ctx.lineTo(list[p][0], list[p][1]);    
}
ctx.stroke();
fs.writeFileSync('hilbert1.png', canvas.toBuffer());
