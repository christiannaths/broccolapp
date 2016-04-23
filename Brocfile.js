var BROCCOLI_ENV   = process.env.BROCCOLI_ENV || 'development';
var TARGET         = process.env.TARGET || 'browser';
var pkg            = require('./package.json');

/**
  * --------------------------------------------------- Dependencies
  */
var Babel               = require('broccoli-babel-transpiler');
var Browserify          = require('broccoli-browserify-cache');
var Sass                = require('broccoli-sass');
var MergeTrees          = require('broccoli-merge-trees');
var Concat              = require('broccoli-concat');
var PickFiles           = require('broccoli-static-compiler');
var Funnel              = require('broccoli-funnel');
var Flatten             = require('broccoli-flatten');
var Uglify              = require('broccoli-uglify-js');
var Autoprefixer        = require('broccoli-autoprefixer');
var MinifyHTML          = require('broccoli-htmlmin');
var Handlebars          = require('handlebars');
var BroccoliHandlebars  = require('broccoli-handlebars');
var SVGO                = require('broccoli-svgo');
var BrowserSync         = require('broccoli-browser-sync');


/**
  * --------------------------------------------------- Trees
  */
var trees           = '';
var views           = 'src/views';
var styles          = 'src/stylesheets';
var images          = 'src/images';
var js              = 'src/javascripts';
var vendor          = 'src/javascripts/vendor';

/**
  * --------------------------------------------------- Views
  */
views = BroccoliHandlebars(views, ['index.hbs'], {
  partials: 'src/views/partials',
  destFile: function (filename) {
    return filename.replace(/\.(hbs|handlebars)$/, '.html').replace(/views/, '');
  },
});

views = MinifyHTML(views);

/**
  * --------------------------------------------------- Styles
  */
styles = Sass([styles], 'index.sass', 'index.css', {
  precision: 10
});

styles = Autoprefixer(styles);

/**
  * --------------------------------------------------- Images
  */
images = Flatten(images);
images = SVGO(images);
images = Funnel(images, {
  destDir: 'assets'
});


/**
  * --------------------------------------------------- App
  */
js = Babel(js, {
  browserPolyfill: true,
  ignore: ['vendor/']
});
js = Browserify(js, {
  entries: ['./index.js'],
  outputFile: 'index.js'
});

if( BROCCOLI_ENV == 'production' ) {
  js = Uglify(js, { compress: true });
}




//
//--------------------------------------------------- Vendor
// var vendorFiles = [
//   '**/react.js',
//   '**/react-dom.js',
// ];

// vendor = Funnel(vendor, {
//   include: vendorFiles
// });

vendor = Concat(vendor, {
  inputFiles: [
    'react.js',
    'react-dom.js',
  ],
  outputFile: '/vendor.js'
});
// vendor = Uglify(vendor, {
//   mangle: true,
//   compress: true,
// });
//
// if( BROCCOLI_ENV == 'production' ) {
// }

//
//--------------------------------------------------- Let's go!


if( TARGET == 'browser' ) {
  var browserSync = new BrowserSync([js, images, styles, views]);
  trees = MergeTrees([js, vendor, images, styles, views, browserSync]);
} else {
  trees = MergeTrees([js, vendor, images, styles, views]);
}

module.exports = trees;
