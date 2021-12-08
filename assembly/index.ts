var R: f32 = 0;
var G: f32 = 0;
var B: f32 = 0;
var width: i32, height: i32;

export function init(w: i32, h: i32): void {
 width = w;
 height = h;
}

// Memory layout:
// First w*h*4 bytes are RGBA
// Next w*h*3 bytes are HSV

/** Gets an input pixel in the range [0, s]. */
@inline
function getHSV(x: u32, y: u32, offset: u8): f32 {
  var b = (width*height*4) + (y * width + x) * 12 + offset;
  return load<f32>(b);
}

@inline
function setRGB(x: u32, y: u32, offset: u8, v: u8): void {
  var b = ((y * width + x) << 2) + offset;
  // trace("Setting", 2, b, v);
  store<u8>(b, v);
}

export function cycle(shift: f32): void {
  var h: f32, s: f32, v: f32;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      h = getHSV(x, y, 0);
      s = getHSV(x, y, 4);
      v = getHSV(x, y, 8);

      h += shift;
      h -= Mathf.floor(h);

      hsv2rgb(h, s, v);

	  //trace("HSV", 3, h, s, v);
	  //trace("RGB", 3, R*255, G*255, B*255);

      setRGB(x, y, 0, <u8>(R * 255));
      setRGB(x, y, 1, <u8>(G * 255));
      setRGB(x, y, 2, <u8>(B * 255));
      setRGB(x, y, 3, <u8>255); // alpha
    }
  }
}

@inline
function hsv2rgb(h: f32, s: f32, v: f32): void {
  h *= 6; 
  var i = Mathf.floor(h);
  var f = h - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (<u32>i % 6) {
    case 0: R = v, G = t, B = p; break;
    case 1: R = q, G = v, B = p; break;
    case 2: R = p, G = v, B = t; break;
    case 3: R = p, G = q, B = v; break;
    case 4: R = t, G = p, B = v; break;
    case 5: R = v, G = p, B = q; break;
  }
}