var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var img = new Image();

img.onload = function() {
  ctx.drawImage(img, 0, 0, img.width,    img.height,     // source rectangle
                     0, 0, canvas.width, canvas.height); // destination rectangle

  imgData = ctx.getImageData(0, 0, img.width, img.height);
  var hsvs = getHSVs(imgData.data);

  cycle(0, ctx, imgData, hsvs);
};

function cycle(shift, ctx, imgData, hsvs) {
  var clone = imgData.data.slice();
  colorShift(shift, clone, hsvs);

  imgData.data.set(clone);
  ctx.putImageData(imgData, 0, 0);

  setTimeout(function() {
    cycle(shift + .035, ctx, imgData, hsvs);
  }, 0);
}

function colorShift(shift, data, hsvs) {
  console.log(hsvs.length);
  for (var i = 0; i < hsvs.length; i++) {
    var [h, s, v] = hsvs[i];

    h = (h + shift) % 1;
    [r, g, b] = hsv2rgb(h, s, v);    

    data[4*i+0] = r;
    data[4*i+1] = g;
    data[4*i+2] = b;
  }
}

function getHSVs(data) {
  var hsvs = new Array();
  for (var i = 0; i < data.length; i+= 4) {
    [r, g, b] = [data[i], data[i+1], data[i+2]];
    hsvs.push(rgb2hsv(r, g, b));
  }
  return hsvs;
}

function rgbToInt(r, g, b) {
    return (r<<16) + (g<<8) + b;
}

function intToRgb(int) {
  return [(int & 0xFF0000)>>16, (int & 0x00FF00)>>8, (int & 0x0000FF)]
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

function hsv2rgb(h, s, v) {
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  return [ r * 255, g * 255, b * 255 ];
}

img.src = 'psychonaut.jpg';
//img.src = 'sky-diamonds.jpg';
//img.src = 'forest-glade-metta.jpg';
//img.src = 'palette.jpg';
//img.src = 'rgby_tiny.jpg';
