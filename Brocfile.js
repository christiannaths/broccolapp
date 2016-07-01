/**
  * --------------------------------------------------- Config
  */
var BROCCOLI_ENV        = process.env.BROCCOLI_ENV || 'development';
var WEBPACK_ENV         = '"' + BROCCOLI_ENV + '"';
var TARGET              = process.env.TARGET || 'browser';
var pkg                 = require('./package.json');
var path                = require('path');
var webpack             = require('webpack');
var hbsHelpers          = require('handlebars-helpers')();
var hbsCore             = require('handlebars');
var trees               = [];

/**
  * --------------------------------------------------- Broccoli plugins
  */
var Babel               = require('broccoli-babel-transpiler');
var Webpack             = require('broccoli-webpack');
var Sass                = require('broccoli-sass');
var CleanCSS            = require('broccoli-clean-css');
var MergeTrees          = require('broccoli-merge-trees');
var Concat              = require('broccoli-concat');
var Funnel              = require('broccoli-funnel');
var Flatten             = require('broccoli-flatten');
var Uglify              = require('broccoli-uglify-js');
var Autoprefixer        = require('broccoli-autoprefixer');
var MinifyHTML          = require('broccoli-htmlmin');
var Handlebars          = require('broccoli-handlebars');
var SVGO                = require('broccoli-svgo');
var ImageMin            = require('broccoli-imagemin');
var AssetRev            = require('broccoli-asset-rev');
var BrowserSync         = require('broccoli-browser-sync');


/**
  * --------------------------------------------------- Views
  */
var htmlTree = 'src';

htmlTree = Handlebars(htmlTree, ['*.hbs'], {
  handlebars: hbsCore,
  partials: 'src/components',
  context: function(filename) {
    if( !/page-with-data\.hbs/.test(filename) ) return;
    return { data: require('./path/to/data.json') };
  },
  destFile: function (filename) {
    if( filename === 'assets' ) return;
    return filename.replace(/(.+)\.(hbs|handlebars)$/, '$1.html');
  },
  helpers: {
    raw: function(string)  {
      return new hbsCore.SafeString(string);
    },
    slug: function(string)  {
      return hbsHelpers.dashcase(string)
    }
  }
});

htmlTree = MinifyHTML(htmlTree);
trees.push(htmlTree);


/**
  * --------------------------------------------------- Styles
  */
var stylesTree = MergeTrees(
  ['src', 'src/components'],
  { overwrite: true }
);

var sassConfig = {
  precision: 10,
  outputStyle: 'expanded',
}

if( BROCCOLI_ENV === 'production' ) {
  sassConfig.outputStyle = 'compressed';
}

stylesTree = Sass([stylesTree], 'style.sass', 'assets/style.css', sassConfig);
stylesTree = Autoprefixer(stylesTree);

if( BROCCOLI_ENV === 'production' ) {
  stylesTree = CleanCSS(stylesTree);
}

trees.push(stylesTree);


/**
  * --------------------------------------------------- Images
  */
var imagesTree = 'src/images';

imagesTree = Funnel(imagesTree, {
  exclude: ['.DS_Store'],
  destDir: 'assets'
});

imagesTree = Flatten(imagesTree, { destDir: 'assets' });

if( BROCCOLI_ENV == 'production' ) {
  var compressionOptions = {
    optimizationLevel: 5,
  }

  imagesTree = ImageMin(imagesTree, compressionOptions);
  imagesTree = SVGO(imagesTree);
}

trees.push(imagesTree);


/**
  * --------------------------------------------------- Fonts
  */
var fontsTree = 'src/fonts';

fonts = Funnel(fontsTree, {
  exclude: ['.DS_Store'],
  destDir: 'assets'
});

trees.push(fontsTree);


/**
  * --------------------------------------------------- Javascript
  */
var jsTree = 'src';

jsTree = Babel(jsTree, {
  browserPolyfill: true,

  "presets": ["es2015"],
  "plugins": [
    ["module-alias", [
      { "src": path.resolve("components"), "expose": "^" }
    ]]
  ],
  "ignore": [
    "vendor/",
  ]


});

jsTree = new Webpack(jsTree, {
  entry: './script',
  output: { filename: 'assets/script.js' },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': WEBPACK_ENV
      }
    })
  ],
  loaders: [
   { test: /\.json$/, loader: 'json' },
  ]
  // externals: [{'react': 'React', 'jquery': '$'}],
});

if( BROCCOLI_ENV === 'production' ) {
  jsTree = Uglify(jsTree, { compress: true });
}

trees.push(jsTree);



/**
  * --------------------------------------------------- Public
  */
var publicTree = 'src/public';

publicTree = Funnel(publicTree, {
  destDir: ''
});

trees.push(publicTree);



/**
  * --------------------------------------------------- AssetRev
  */
var assetRevOptions = {
  extensions: ['js', 'css', 'png', 'jpg', 'gif', 'svg'],
  replaceExtensions: ['html', 'js', 'css'],
  prepend: '/'
}

if( BROCCOLI_ENV === 'production' ) {
  trees = new AssetRev(MergeTrees(trees, { overwrite: true }), assetRevOptions);
  trees = [trees];
}


//
//--------------------------------------------------- Let's go!
if( TARGET == 'browser' ) {
  var browserSyncOptions = {
    browserSync: { notify: false }
  }
  var browserSyncTrees = trees.slice(0);
  var browserSync = new BrowserSync(browserSyncTrees, browserSyncOptions);
  trees.push(browserSync)
}

module.exports = MergeTrees(trees, { overwrite: true });
