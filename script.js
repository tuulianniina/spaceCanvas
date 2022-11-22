/*there are currently two layered canvases aligned
with canvas2 as the top layer, later on more layers should be added*/

const canvas1 = document.getElementById("space1");
const context1 = canvas1.getContext("2d");

const canvas2 = document.getElementById("space2");
const context2 = canvas2.getContext("2d");

canvas1.width = window.innerWidth;
canvas1.height = Math.round(window.outerHeight * 1.1);

canvas2.width = canvas1.width;
canvas2.height = canvas1.height;

const bound = canvas2.getBoundingClientRect();

const vals = {};

window.onload = function() {
  init();
}

document.addEventListener("click", (event) => {
  var cX = event.clientX - bound.left;
  var cY = event.clientY - bound.top;
  initDraw(cX, cY);
});

function initDraw(cX, cY) {
  // there could be a minimum size
  var size = Math.floor(canvas2.height * 0.008);
  var r = Math.round(size * Math.random());
  (r < 2) ? r = 2 : r;
  //maybe change to a general obj() later vv
  star(cX, cY, r);
}

//star colors could be in relation to their actual rarity and/or adjustable
//rn they're just randomly selected from the list

function rClr() {
  var n = Math.round(Math.random() * (vals.l - 1));
  return vals.starClrs[n];
}

function init() {
  vals.hex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
  vals.starClrs = ["#ff6813", "#ff6e17", "#ff731b", "#ff7920", "#ff7e24", "#ff8429", "#ff892e", "#ff8d33", "#ff9238", "#ff973e", "#ff9b43",
                "#ff9f49", "#ffa44f", "#ffa855", "#ffac5b", "#ffaf61", "#ffb367", "#ffb76d", "#ffba73", "#ffbe79", "#ffc180", "#ffc486",
                "#ffc78c", "#ffca92", "#ffcd98", "#ffd09f", "#ffd2a5", "#ffd5ab", "#ffd8b1", "#ffdab7", "#ffddbd", "#ffdfc3", "#ffe1c9",
                "#ffe4cf", "#ffe6d4", "#ffe8da", "#ffeae0", "#ffece6", "#ffeeeb", "#fff0f1", "#fff2f6", "#fff3fc", "#fcf3ff", "#f7f0ff",
                "#f2edff", "#eeeaff", "#e9e7ff", "#e5e4ff", "#dddfff", "#d6daff", "#d0d6ff", "#cad2ff", "#c5ceff", "#c0cbff", "#bbc7ff",
                "#b7c4ff", "#b3c2ff", "#afbfff", "#abbcff", "#a8baff", "#a5b8ff", "#a2b6ff", "#a0b4ff", "#9db2ff", "#9bb0ff", "#99aeff",
                "#96adff", "#94abff", "#93aaff", "#91a8ff", "#8fa7ff", "#8da6ff", "#8ca4ff"];
  vals.l = vals.starClrs.length;
}

function star(cX, cY, r) {
  var clr1 = rClr();
  var clr = fill_circle(context2, cX, cY, 0, r, clr1, dFade, false);
  var clr2 = fill_circle(context1, cX, cY, r, r * 5, clr, dFade, true);
  //circle_border(context1, cX, cY, r, clr); 
  spikes(context1, cX, cY, r, clr1);
}

//circle_border draws only a pixel perfect border

function circle_border(ctx, cX, cY, r, clr) {
  ctx.fillStyle = clr;
  while (r > 0) {
  var x = r;
  var r = r;
  var y = 0;
  var r2 = Math.floor(r * 0.707);
  drawC(ctx, cX, cY, x, y, 1);
  while (y <= r2) {
   y += 1;
   x = Math.round(Math.sqrt(r * r - y * y));
   drawC(ctx, cX, cY, x, y, 1);
  }
  r = r - 1;
  }
}

//fill_circle could use some cleaning up, too many function parameters
//shading should be in relation to size and adjustable
//rn middle size shading doesn't look good and scale is fixed

/*parameters: context, centerX, centerY, start, target, color, 
function for changing color, boolean to turn on color function*/

function fill_circle(ctx, cX, cY, st, tgt, clr, func, bool) {
  var l = tgt - st;
  var px = 1;
  var clr = clr;
  var r = st;
  var x;
  var x0;
  var x1;
  while (r <= tgt) {
    ctx.fillStyle = clr;
    var r2 = Math.round(r * 0.707);
    var y = 0;
    drawC(ctx, cX, cY, r, y, px);
    while (y <= r2) {
      x = Math.sqrt(r * r - y * y);
      x0 = Math.floor(x);
      x1 = Math.round(x);
      if (x0 < x1) {
        drawC(ctx, cX, cY, x0, y, px);
      }
      drawC(ctx, cX, cY, x1, y, px);
      y += 1;
    }
    r += 1;
    if (bool && r % 4 !== 0) clr = func(clr);
    if (bool && l < 12) clr = func(clr);
  }
  return dFade(clr);
}

function drawC(ctx, cX, cY, x, y, px) {
  ctx.fillRect(cX+x, cY+y, px, px);
  ctx.fillRect(cX-x, cY+y, px, px);
  ctx.fillRect(cX+x, cY-y, px, px);
  ctx.fillRect(cX-x, cY-y, px, px);
  ctx.fillRect(cX+y, cY+x, px, px);
  ctx.fillRect(cX-y, cY+x, px, px);
  ctx.fillRect(cX+y, cY-x, px, px);
  ctx.fillRect(cX-y, cY-x, px, px);
}

//rn there's no functions for when objects overlap

/*function transp(ctx, r) {
  transp.alpha += (r * 0.001);
  ctx.globalAlpha = transp.alpha;
}*/

/*spikes() doesn't look super great,
 a function to rotate straight lines is needed*/

/* miku: could be something like
    function rotate(x, y, x1, y1, rotationAngle)
      {
        center.x = x + ((x1 - x) / 2);
        center.y = y + ((y1 - y) / 2);
        hypotenuseLength = sqrt((x1 - center.x)*(x1 - center.x) - (y1 - center.y)(*(y1 - center.y))
        
        // toinen puoli viivasta
        currentAngle = asin( (y1 - center.y) / hypotenuseLength );
        new.x1 = center.x + acos (currentAngle + rotationAngle) * hypotenuseLength;
        new.y1 = center.y + asin (currentAngle + rotationAngle) * hypotenuseLength;
        
        // toinen puoli viivasta
        currentAngle = asin( (y - center.y) / hypotenuseLength );
        new.x = center.x - acos (currentAngle + rotationAngle) * hypotenuseLength;
        new.y = center.y - asin (currentAngle + rotationAngle) * hypotenuseLength;
      } */

function spikes(ctx, cX, cY, r, clr) {
  var clr = clr;
  var l = r * 8;
  var target = Math.floor(r * 0.5);
  var cX = cX;
  var cY = cY;
  var x0 = cX + r;
  var x1 = cX - r;
  var y0 = cY + r;
  var y1 = cY - r;
  for (var i = 0; i < l; i++) {
    ctx.fillStyle = clr;
    ctx.fillRect(x0, cY, 1, 1);
    ctx.fillRect(x1, cY, 1, 1);
    ctx.fillRect(cX, y0, 1, 1);
    ctx.fillRect(cX, y1, 1, 1);
    if (i % 2 === 0 || l < 17) clr = dFade(clr);
    var clr1 = dFade(clr);
    ctx.fillStyle = clr1;
    for (var j = -1; j < 2; j += 2) {
      ctx.fillRect(x0, cY+j, 1, 1);
      ctx.fillRect(x1, cY+j, 1, 1);
      ctx.fillRect(cX+j, y0, 1, 1);
      ctx.fillRect(cX+j, y1, 1, 1);
    }
    x0++;
    x1--;
    y0++;
    y1--;
  }
}

function sameClr(clr) {
  return clr;
}

//functions for darker and lighter color fade, lFade() probably doesn't work rn
//sometimes dFade() seems to stop before full black

function dFade(clr) {
    var clr = clr;  // miku: seems like an unnecessary declaration?
    var i = 1;
    var arr = clr.split("");
    for (var j = 0; j < 16; j++) {
      if (arr[i] === "0" && i < 6) {
        i += 1;
        j = 0;
        continue;  // miku: didn't know this command, seems very useful
      }
      if (vals.hex[j] === arr[i]) {
        arr[i] = vals.hex[j-1];

        i += 1;
        j = 0;
      }
      if (i === 6) j = 16;
    }
    var clr = arr[0]+arr[1]+arr[2]+arr[3]+arr[4]+arr[5]+arr[6];
    return clr;
}

function lFade(clr) {
  var clr = clr;
  var i = 1;
  var arr = clr.split("");
  for (var j = 0; j < 16; j++) {
    if (arr[i] === "f" && arr[i] !== 6) {
      i += 1;
      j = 0;
      continue;
    }
    if (vals.hex[j] === arr[i]) {
      arr[i] = vals.hex[j+1];
      i += 1;
      j = 0;
    }
    if (i === 6) j = 16;
  }
  //THIS ATTR IS MISSING vv <--- can't remember what this is supposed to refer to
  clr = arr[0]+arr[1]+arr[2]+arr[3]+arr[4]+arr[5]+arr[6];
  return clr;
}

