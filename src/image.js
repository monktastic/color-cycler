
// Set up the canvas with a 2D rendering context
var cnv = document.getElementById("canvas");
var ctx = cnv.getContext("2d");

var memory;
var img = new Image();

img.onload = function() {
  // Compute the size of and instantiate the module's memory
  // 4 bytes for RGBA, 12 bytes for HSV
  var byteSize = img.width * img.height * 16;
  var pages = ((byteSize + 0xffff) & ~0xffff) >>> 16;
  memory = new WebAssembly.Memory({ initial: pages });
  console.log("Allocated pages:", pages);
  console.log("Width and height", img.width, img.height);
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, img.width,    img.height,     // source rectangle
                     0, 0, canvas.width, canvas.height); // destination rectangle

  var imgData = ctx.getImageData(0, 0, img.width, img.height);  
  var shift = 0;

  // Fetch and instantiate the module
  fetch("../build/optimized.wasm")
  .then(response => response.arrayBuffer())
  .then(buffer => WebAssembly.instantiate(buffer, {
    env: {
      memory: memory,
      abort: function() {},
      trace: console.log,  
    },
    config: {}, // TODO
    Math
  }))
  .then(module => {
    var exports = module.instance.exports;
    exports.init(img.width, img.height);

    var hsvOffset = img.width*img.height*4;
    var hsvMem = new Float32Array(memory.buffer, hsvOffset);
    setHSVs(imgData.data, hsvMem);    

    var mem = new Uint8Array(memory.buffer);
    var imageData = ctx.createImageData(img.width, img.height);
    var argb = new Uint8Array(imageData.data.buffer);

    (function update() {
      setTimeout(update, 0);
      exports.cycle(shift);
      shift = (shift + 0.035) % 1;

      argb.set(mem.subarray(0, img.width * img.height * 4)); // copy memory image to image buffer
      ctx.putImageData(imageData, 0, 0);         // apply image buffer
    })();

    // Keep rendering the output
    // var imageData = ctx.createImageData(img.width, img.height);
    // var argb = new Uint8Array(imageData.data.buffer);
    // (function render() {
    //   requestAnimationFrame(render);
    //   argb.set(mem.subarray(0, img.width * img.height * 4)); // copy memory image to image buffer
    //   ctx.putImageData(imageData, 0, 0);         // apply image buffer
    // })();
  }).catch(err => {
    alert("Failed to load WASM: " + err.message + " (ad blocker, maybe?)");
    console.log(err.stack);
  });
};

function setHSVs(data, hsvMem) {
  var hsvs = new Array();
  hsvMem[0] = 123.456;
  for (var i = 0; i < data.length/4; i+= 1) {
    [r, g, b] = [data[4*i], data[4*i+1], data[4*i+2]];
    [h, s, v] = rgb2hsv(r, g, b);  
    hsvMem[3*i+0] = h;
    hsvMem[3*i+1] = s;
    hsvMem[3*i+2] = v;
    //console.log(i, r, g, b, h, s, v, hsvMem[3*i]);
  }
  console.log("hsvMem", hsvMem);
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

// img.src = 'psychonaut.jpg';
// img.src = 'sky-diamonds.jpg';
// img.src = 'forest-glade-metta.jpg';
img.src = 'ayahuasca.jpg';
// img.src = 'palette.jpg';
// img.src = 'rgby_tiny.jpg';
