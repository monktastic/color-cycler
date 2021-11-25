
> uncaught domexception: failed to execute 'getimagedata' on 'canvasrenderingcontext2d': the source width is 0.

Oh, I have to do it on img.onLoad.

> Uncaught DOMException: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The canvas has been tainted by cross-origin data.

What?! My image is coming from the local directory. Oh:

https://stackoverflow.com/questions/16217521/i-get-a-canvas-has-been-tainted-error-in-chrome-but-not-in-ff
"Chrome does not consider different local files to be sourced from the same domain. That is, each local file you reference via a file:// URL is treated as if it comes from a unique domain separate from that of other file:// URLs. That they're in the same directory makes no difference."

So maybe set img.crossOrigin="anonymous";

> Access to image at 'file:///Users/aprasad/git/color-cycler/src/sky-diamonds.jpg' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https.

Oh, right, instead of loading my HTML from chrome via localhost, serve it via a local webserver.

> [Set contains duplicates]

Oh, right: two dicts are compared by object reference, not by contents. Same with arrays. So I can't really make a Set of RGB dicts/arrays.

> Tons of memory errors


Now with AssemblyScript:

adityas-mbp-2:color-cycler aprasad$ npm update
dyld: Library not loaded: /usr/local/opt/icu4c/lib/libicui18n.67.dylib
  Referenced from: /usr/local/bin/node
  Reason: image not found
Abort trap: 6

https://stackoverflow.com/questions/53828891/dyld-library-not-loaded-usr-local-opt-icu4c-lib-libicui18n-62-dylib-error-run

adityas-mbp-2:color-cycler aprasad$ brew update
touch: /usr/local/Homebrew/.git/FETCH_HEAD: Permission denied

$ sudo chown -R $(whoami) /usr/local/Homebrew/
$ brew update
(works now)

