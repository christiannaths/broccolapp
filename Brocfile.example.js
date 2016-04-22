var pkg = require('./package.json');

//
//--------------------------------------------------- Dependencies
var ES6                 = require('broccoli-babel-transpiler');
var FastBrowserify      = require('broccoli-fast-browserify');
var Sass                = require('broccoli-sass');
var MergeTrees          = require('broccoli-merge-trees');
var Concat              = require('broccoli-concat');
var PickFiles           = require('broccoli-static-compiler');
var Funnel              = require('broccoli-funnel')
var Uglify              = require('broccoli-uglify-js');
var Autoprefixer        = require('broccoli-autoprefixer');
var MinifyHTML          = require('broccoli-htmlmin');
var Handlebars          = require('handlebars');
var BroccoliHandlebars  = require('broccoli-handlebars');
var BrowserSync         = require('broccoli-browser-sync');
var ENV                 = require('broccoli-env').getEnv();


//
//--------------------------------------------------- Trees
var views   = 'src/views';
var styles  = 'src/stylesheets';
var images  = 'src/images';
var app     = 'src/javascripts';
var vendor  = 'node_modules';

//
//--------------------------------------------------- Views
views = BroccoliHandlebars(views, ['**/*.hbs'], {
  partials: 'src/views/partials',
  destFile: function (filename) {
    return filename.replace(/\.(hbs|handlebars)$/, '.html').replace(/views/, '');
  },
});

views = MinifyHTML(views);

//
//--------------------------------------------------- Styles
styles = Sass([styles], 'style.sass', 'assets/style.css', {
  precision: 10
});

styles = Autoprefixer(styles);

//
//--------------------------------------------------- Images
images = Funnel(images, { destDir: 'assets' });

//
//--------------------------------------------------- App
app = ES6(app, {
  stage: 0,
  moduleIds: true,
  // modules: 'amd',
  browserPolyfill: true,
  filterExtensions: ['js', 'es6'],

  // Transforms /index.js files to use their containing directory name
  // getModuleId: function (name) {
  //   name = pkg.name + '/' + name;
  //   return name.replace(/\/index$/, '');
  // },

  // // Fix relative imports inside /index's
  // resolveModuleSource: function (source, filename) {
  //   var match = filename.match(/(.+)\/index\.\S+$/i);

  //   // is this an import inside an /index file?
  //   if (match) {
  //     var path = match[1];
  //     return source
  //       .replace(/^\.\//, path + '/')
  //       .replace(/^\.\.\//, '');
  //   } else {
  //     return source;
  //   }
  // }
});

app = FastBrowserify(app, {
  bundles: {
    'assets/app.js': {
      entryPoints: ['**/index.js']
    }
  }
});

// app = Concat(app, {
//   inputFiles: [
//     '**/*.js'
//   ],
//   outputFile: '/assets/app.js'
// });


//
//--------------------------------------------------- Vendor
// var vendorFiles = [
//   '**/dist/jquery.js',
// ];

// vendor = Funnel(vendor, {
//   include: vendorFiles
// });

// vendor = Concat(vendor, {
//   inputFiles: vendorFiles,
//   outputFile: "/vendor.js"
// });

//
//--------------------------------------------------- Browser Sync
var browserSync = new BrowserSync([app, images, styles, views]);
var modules = MergeTrees([views, styles, images, app, browserSync]);

//
//--------------------------------------------------- Let's go!
if( ENV == 'production' ) {
  app = Uglify(app, { compress: true });
  vendor = Uglify(vendor, {
    mangle: true,
    compress: true,
  });

  modules = MergeTrees([views, styles, images, app]);
}

module.exports = modules
