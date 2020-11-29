var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var img = new Image();

img.onload = function() {
  ctx.drawImage(img, 0, 0, img.width,    img.height,     // source rectangle
                    0, 0, canvas.width, canvas.height); // destination rectangle

  var wid = 1;
  // var x = 0;
  // for (var i = 0; i < canvas.width/wid; i++) {
  //   var colorStr = '#'+Math.floor(Math.random()*16777215).toString(16);
  //   ctx.fillStyle = colorStr;
  //   ctx.fillRect(x, 0, x+wid, 10);
  //   x += wid;
  // }

  // imgData = ctx.getImageData(0, 0, img.width, img.height);
  imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var [dict, pixelToIdx] = getColors(imgData.data);
  console.log(dict);

  var x = 0;
  for (var entry of dict) {
    var [r, g, b] = intToRgb(entry.rgb);
    ctx.fillStyle = rgbToHex(r, g, b);
    ctx.fillRect(x, 10, x+wid, 10);
    x += wid;
  }

  //cycle(0, ctx, imgData, dict, pixelToIdx);
};

function cycle(i, ctx, imgData, dict, pixelToIdx) {
  //await new Promise(r => setTimeout(r, 1000));
  //invertColors(imgData.data);
  // const clone = new ArrayBuffer(imgData.data.length);
  var clone = imgData.data.slice();
  //console.log('img.data', imgData.data);
  //console.log('clone', clone);
  colorShift(clone, dict, pixelToIdx, i);
  //console.log(clone);    
  imgData.data.set(clone);
  ctx.putImageData(imgData, 0, 0);
  console.log(i, dict.length)
  setTimeout(function() {
    cycle(i+1, ctx, imgData, dict, pixelToIdx);
  }, 1000);
}

// TODO rename dict
function colorShift(data, dict, pixelToIdx, steps) {
  var numColors = dict.length;

  for (var i = 0; i < pixelToIdx.length; i++) {
    colorIdx = (pixelToIdx[i] + steps) % numColors;
    rgbInt = dict[colorIdx].rgb;
    //console.log(colorIdx);
    var [r, g, b] = intToRgb(rgbInt);
    //console.log(r, g, b);
    data[4*i+0] = r;
    data[4*i+1] = g;
    data[4*i+2] = b;
  }
}

function getColors(imgData) {
  var data = imgData;
  var uniqRgb = new Map();
  var idx = 0;

  // For each pixel, the index of its color.
  var pixelToIdx = new Array();

  for (var i = 0; i < data.length; i+= 4) {
    rgb = rgbToInt(data[i], data[i+1], data[i+2]);
    existingIdx = uniqRgb.get(rgb)
    if (existingIdx === undefined) {
      pixelToIdx.push(idx);
      uniqRgb.set(rgb, idx++);
    } else {
      pixelToIdx.push(existingIdx);
    }
  }

  console.log("uniqRgb", uniqRgb);

  var d = [];
  for (var entry of uniqRgb) {
    // TODO: rename rgbInt
    d.push({idx: entry[1], rgb: entry[0], hlv: colorIntToHlv(entry[0])})
  }
  d.sort(function (a, b) {return compareHlv(a.hlv, b.hlv)})
  //console.log(d);

  // TODO: extract and test
  var inverseIdx = new Array(d.length);
  for (var i = 0; i < d.length; i++) {
    inverseIdx[d[i].idx] = i;
  }

  var pixelToNewIdx = new Array();
  for (var idx of pixelToIdx) {
    pixelToNewIdx.push(inverseIdx[idx]);
  }

  //console.log(d);
  return [d, pixelToNewIdx];
}

function compareHlv(hlv1, hlv2) {
  var res = _compareHlv(hlv1, hlv2);
  //console.log(hlv1, hlv2, res);
  return res;
}

function _compareHlv(hlv1, hlv2) {
  if (hlv1.h < hlv2.h) {
    return -1;
  } else if (hlv1.h > hlv2.h) {
    return 1;
  }

  if (hlv1.l < hlv2.l) {
    return -1;
  } else if (hlv1.l > hlv2.l) {
    return 1;
  }

  if (hlv1.v < hlv2.v) {
    return -1;
  } else if (hlv1.v > hlv2.v) {
    return 1;
  }

  return 0;
}

function invertColors(data) {
  for (var i = 0; i < data.length; i+= 4) {
    data[i] = data[i] ^ 255; // Invert Red
    data[i+1] = data[i+1] ^ 255; // Invert Green
    data[i+2] = data[i+2] ^ 255; // Invert Blue
  }
}

function rgbToInt(r, g, b) {
    return (r<<16) + (g<<8) + b;
}

function intToRgb(int) {
  return [(int & 0xFF0000)>>16, (int & 0x00FF00)>>8, (int & 0x0000FF)]
}

function colorIntToHlv(colorInt, repetitions=7) {
 [r, g, b] = intToRgb(colorInt)
 lum = Math.sqrt(.241 * r + .691 * g + .068 * b)
 
 var [h, s, v] = rgb2hsv(r, g, b)
 
 h = Math.floor(h * repetitions)
 lum = Math.floor(lum * repetitions)
 v = Math.floor(v * repetitions)
 
 if (h % 2 == 1) {
   v = repetitions - v
   lum = repetitions - lum
 }

 return {h: h, l: lum, v: v}
}


function rgb2hsv(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;

  var d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, v ];
}


function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


//img.src = 'sky-diamonds.jpg';
img.src = 'palette.jpg';
//img.src = 'rgby_tiny.jpg';
