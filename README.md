# videojs-dvrseekbar

A Video.js plugin for Seekbar with DVR support.

## Installation

```sh
npm install --save videojs-dvrseekbar
```

## Usage

To include videojs-dvrseekbar on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-dvrseekbar.min.js"></script>
<script>
  var player = videojs('my-video');

  player.dvrseekbar();
</script>
```

### Browserify

When using with Browserify, install videojs-dvrseekbar via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-dvrseekbar');

var player = videojs('my-video');

player.dvrseekbar();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-dvrseekbar'], function(videojs) {
  var player = videojs('my-video');

  player.dvrseekbar();
});
```

### VideoJS plugin standards and development flow
See https://github.com/videojs/generator-videojs-plugin/blob/master/docs/standards.md

### How to version
Run ```npm version [patch | minor | major]``` to bump package.json version and generate a new release.
A new tag with the dist files will be created (run ```git push remote tagname``` to publish the tag).

[videojs]: http://videojs.com/

### License

Apache-2.0. Copyright (c) ToolBox-tve
