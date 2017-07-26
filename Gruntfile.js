module.exports = function(grunt) {
  grunt.initConfig({
    //===========================================================================================================
    // grunt-contrib-jade
    //
    // grunt-contrib-jade compile jade files into html files.
    //
    // First task compiles all .jade files from site-pages folder to HTML (partials folder holds repeating page elements,
    // which are included within .jade pages. Jade files from this folder will not be compiled to HTML.)
    //
    // Second task compiles svg holder html page which holds all svg icons. This file will be included additionaly
    // in all HTML pages with javascript and it will be cached in local storage.
    //
    //===========================================================================================================

    jade: {
      compile: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: "source/site-pages/", // Starting location of .jade files.
            src: ["*.jade", "!**config.jade**", "!**pagewrapper.jade**"],
            dest: ".", // Destination of compiled .html files.
            ext: ".html"
          }
        ],
        options: {
          pretty: true, // Keep the .html files minified/unminified.
          basedir: "source/site-pages/partials" // Location of .jade partials.
        }
      },
      compileSvgHolder: {
        options: {
          data: {
            debug: false
          }
        },
        files: {
          "assets/images/icons/svg-holder.html": [
            "source/site-pages/partials/svg-holder.jade"
          ]
        }
      }
    },
    //===========================================================================================================
    // grunt-contrib-less
    //
    // grunt-contrib-less compile less files into css files.
    // Two less tasks are defined:
    // Development task creates unminified css file with the sourcemap.
    // Deploy task creates minified css file.
    //===========================================================================================================

    less: {
      development: {
        // Compile unminified css.
        options: {
          // sourcemap: true,                // Generate source map - This map is not available at the moment.
          banner: "/* Author: Danijel Grabež */\n" // Banner will be added at the top of the compiled file.
        },
        files: {
          // Dictionary of files (destination : start location).
          "assets/css/style.css": "source/less/style.less"
        }
      },

      deploy: {
        // Compile minified css.
        options: {
          compress: true, // Css output style.
          banner: "/* Author: Danijel Grabež */\n" // Banner will be added at the top of the compiled file.
        },
        files: {
          // Dictionary of files (destination : start location).
          "assets/css/style.min.css": "source/less/style.less"
        }
      }
    },
    //===========================================================================================================
    // grunt-postcss
    //
    // grunt-postcss task run autoprefixing for compiled css files.
    // This task depends on autoprefixer-core which provide css prefixes based on defined browser support.
    //===========================================================================================================

    postcss: {
      options: {
        // map: {
        //   inline: false,                                       // save all sourcemaps as separate files
        //   annotation: 'assets/css/'                            // to the specified directory
        // },
        processors: [
          require("autoprefixer-core")({ browsers: "> 1%" }) // autoprefixer core represents dependency package.
        ]
      },
      dist: {
        src: "assets/css/*.css" // destination of css files which will be prefixed.
      }
    },
    //===========================================================================================================
    // grunt-contrib-jshint
    //
    // grunt-contrib-jshint task look for possible errors in the javascript files.
    // jshint-stylish provide prettier console output.
    //===========================================================================================================

    jshint: {
      all: "source/js/components/**/*.js",
      options: {
        reporter: require("jshint-stylish"),
        eqeqeq: true, // Prohibit the use of == and != in favor of === and !==
        curly: true // Require you to always put curly braces around blocks in loops and conditionals.
      }
    },
    //===========================================================================================================
    // grunt-contrib-uglify
    //
    // grunt-contrib-uglify task concatintate, minify and uglify javascript files.
    // Two uglify tasks are defined:
    // jsbase uglify task compiles support scripts for older browsers.
    // js uglify task compiles plugin(s) which are used througout the project along with the custom javascript.
    //===========================================================================================================

    uglify: {
      jsbase: {
        options: {
          preserveComments: "none" // Remove unnecessary comments.
        },
        files: [
          {
            src: [
              // Jquery fallback (in case that cdn version is not loaded).
              "source/js/vendor/jquery/jquery-2.1.0.min.js"
            ],
            dest: "assets/js/jquery-2.1.0.min.js"
          },
          {
            src: [
              // Modernizr (custom made).
              "source/js/vendor/modernizr/modernizr.min.js"
            ],
            dest: "assets/js/modernizr.min.js"
          },
          {
            src: ["source/js/vendor/typed-js/typed.min.js"],
            dest: "assets/js/typed.min.js"
          },
          {
            src: [
              // IE polyfills - Modernizr, Respond and Selectivizr
              "source/js/vendor/ie/modernizr.min.js", // (they are loaded for IE < 9).
              "source/js/vendor/ie/respond.js",
              "source/js/vendor/ie/selectivizr.js"
            ],
            dest: "assets/js/ie.min.js"
          }
        ]
      },

      js: {
        options: {
          preserveComments: "some", // Keep the comments.
          banner: "/* Author: Danijel Grabež */\n" // Banner will be added at the top of the compiled file.
        },
        files: [
          {
            src: [
              // List of plugins which are used on this project, along with
              "source/js/components/main.js" // custom made javascript.
            ],
            dest: "assets/js/script.min.js"
          }
        ]
      }
    },
    //===========================================================================================================
    // grunt-contrib-imagemin
    //
    // grunt-contrib-imagemin optimize images for the web
    // (.png, .jpeg, .svg, .gif are possible to be optimized).
    //===========================================================================================================

    imagemin: {
      png: {
        options: {
          optimizationLevel: 3 // Compression level.
        },
        files: [
          {
            expand: true, // Dynamic expansion.
            cwd: "source/images/",
            src: ["**/*.png"],
            dest: "assets/images",
            ext: ".png"
          }
        ]
      },
      jpg: {
        options: {
          progressive: true // Lossless or progressive conversion.
        },
        files: [
          {
            expand: true,
            cwd: "source/images/",
            src: ["**/*.jpg"],
            dest: "assets/images",
            ext: ".jpg"
          }
        ]
      }
    },
    //===========================================================================================================
    // grunt-svgstore
    //
    // grunt-svgstore task create svg sprite from source/images/icons folder.
    //
    // Description:
    // Generated svg sprite can be found inside assets/images/icons/ folder.
    // Svg code needs to be added inside .svg-holder class which should be placed right bellow the opening <body> tag:
    // <div class="svg-holder"> SVG SPRITE CODE GOES HERE </div>
    //
    // A file named svg-holder.jade should hold the svg code. This file can be found inside source/site-pages/partials folder.
    // Page which contains svg icons will need to have svg-holder.jade included (via `include svg-holder.jade` line).

    // At the moment only modified .jade files are compiled to .html files (this is enabled with grunt-newer task).
    // In order to "refresh" the content inside .svg-holder element across other pages newer: will need to be removed from the jade task.

    svgstore: {
      icons: {
        files: {
          "assets/images/icons/icons.svg": ["source/images/icons/*.svg"]
        },
        options: {
          prefix: "icon-", // add prefix to all icons with an unambiguous label

          cleanup: true, // cleans fill, stroke, stroke-width attributes
          // so that we can style them from the css.

          convertNameToId: function(name) {
            // write a custom function to strip the first part
            return name.replace(/^\w+\_/, ""); // of the file that Adobe Illustrator generates
          } // when exporting the artboards to SVG.
        }
      }
    },
    //===========================================================================================================
    // grunt-contrib-copy
    //
    // grunt-contrib-copy task copy files from one location to the another.
    // In this scenario all JavaScript files will be copied to assets/js/ folder.

    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: "source/js",
            src: [
              "**",
              "!**vendor/ie/**",
              "!**vendor/jquery/**",
              "!**vendor/modernizr/**",
              "!**components/helper-scripts.js**",
              "!**components/overlay.js**"
            ],
            dest: "assets/js/unminified"
          }
        ]
      }
    },
    //===========================================================================================================
    // grunt-contrib-watch
    //
    // grunt-contrib-watch task run tasks whenever watched files change.
    // Livereload option enables browser refreshing when this task is run
    // (livereload extension needs to be enabled on your browser).
    // grunt-watch action triggers with 'grunt watch-files' which listen file changes and triggers
    // certain action (in this case we are listening to the html, css, javascript, image and svg files).
    //===========================================================================================================

    watch: {
      options: {
        livereload: true // Show changes on browser without page refreshing.
      },

      html: {
        // Refresh the browser when there are changes in html, css or js.
        files: [
          "source/site-pages/**/*.jade",
          "source/less/**/*.less",
          "source/js/**/*.js"
        ],
        tasks: ["compile-html"], // This task includes html partials from source/pages/layout
        options: {
          // and then compiles html pages in root directory.
          spawn: false,
          livereload: true
        }
      },

      css: {
        files: ["source/less/**/*.less"], // When file from source/less folder is changed, run compile-css action.
        tasks: ["compile-css"], // This task compiles less into css, and then run postcss task.
        options: {
          // With combined actions we have to make correct task completion order
          spawn: false // (compile css and then postcss for autoprefixing).
        }
      },

      scripts: {
        // When file from source/js folder is changed, run compile-js action
        files: ["source/js/**/*.js"], // (uglify and jshint tasks combined).
        tasks: ["compile-js"],
        options: {
          spawn: false
        }
      },

      imagemin: {
        // When we add, or change image from source/images folder, imagemin task is run.
        files: ["source/images/**/*.jpg", "source/images/**/*.png"],
        tasks: ["optimize-images"]
      },

      svgstore: {
        // When svg file is added, or modified from the source/images/icons folder
        files: ["source/images/icons/*.svg"], // run svgstore task which will create new svg sprite in root/images/icons folder.
        tasks: ["svgstore"]
      }
    },
    //===========================================================================================================
    // grunt-browser-sync
    //
    // grunt-browser-sync will synchronize the browser upon file changes.
    // When the files are compiled by watch task, browser will refresh the page.
    //===========================================================================================================

    browserSync: {
      synchronize: {
        bsFiles: {
          // Reload the browser when these files are changed
          src: [
            "*.html",
            "assets/images/icons/svg-holder.html", // SVG icons (served via javascript to the localstorage)
            "assets/css/*.css",
            "assets/js/*.js"
          ]
        },
        options: {
          watchTask: true, // Synchronize with grunt-contrib-watch task
          server: "./", // (when watch tasks compile files, browser will be reloaded)
          ui: false, // Don't provide browser sync user interface (that is accessed via a separate port)
          port: 9000,
          notify: false, // Don't show any notifications in the browser.
          logLevel: "silent", // Don't show browsersync log messages
          tunnel: "dgraphlifeboat", // Tunnel the Browsersync server through --> http://dgraphlifeboat.localtunnel.me
          online: true // Some features of Browsersync (such as xip & tunnel) require an internet connection,
          // but if you're working offline, you can reduce start-up time by setting this option to `false`.
        }
      }
    },

    sitemap: {
      dist: {
        pattern: ["*.html"],
        siteRoot: "./"
      }
    }
  });

  // Measures the time each task takes.
  // Does not work with grunt watch task, only separate task(s).
  require("time-grunt")(grunt);

  // Load installed plugins.
  // All installed plugins which are used in this project.
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-postcss");
  grunt.loadNpmTasks("grunt-contrib-imagemin");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-svgstore");
  grunt.loadNpmTasks("grunt-contrib-jade");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-browser-sync");
  grunt.loadNpmTasks("grunt-sitemap");

  grunt.loadNpmTasks("grunt-newer");
  // Grunt-newer plugin increases task running speed.
  // Settings require only adding 'newer:' as the first argument when running other tasks
  // (see registered tasks bellow - only images for now).

  //Run Tasks in specific order
  // All task(s) - Runs with 'grunt' command.
  grunt.registerTask("default", [
    "jade",
    "uglify",
    "jshint",
    "less",
    "postcss",
    "imagemin",
    "svgstore",
    "sitemap"
  ]);
  // Build html files from jade files.
  grunt.registerTask("compile-html", ["jade"]);
  // Compile less files (first compile less into css, and then run postcss task).
  grunt.registerTask("compile-css", ["less", "postcss"]);
  // Compile main js files (first run uglify task, and then run jshint task).
  grunt.registerTask("compile-js", ["uglify:js", "jshint"]);
  // Compile base js files (fallback for older browsers). This task is already built and scripts are
  // placed inside assets/js folder; grunt-watch doesn't watch for changes which are defined within this task.
  grunt.registerTask("compile-js-base", ["uglify:jsbase", "jshint"]);
  // Optimize images.
  grunt.registerTask("optimize-images", ["newer:imagemin"]);
  // Generate svg sprites.
  grunt.registerTask("icons", ["svgstore"]);
  // Copy files to production
  grunt.registerTask("copy-files", ["copy"]);

  // Main task:
  // 1. 'grunt watch-files' - watch file changes and refresh the browser upon these changes.
  grunt.registerTask("watch-files", ["browserSync", "watch"]);
};
