module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    /*ПРОВЕРИТЬ ПОСЛЕДОВАТЕЛЬНОСТЬ*/
    less: {
      style: {
        files: {
          "build/css/style.css": "less/style.less"
        }
      }
    },
    postcss: {
      options: {
        processors: [
          require("autoprefixer")({browsers: ['last 1 version', 'ie 11']})
        ]
      },
      style: {
        src: "build/css/*.css"
      }
    },
    watch: {
      html: {
        files: ["*.html"],
        tasks: ["posthtml"]
      },
      style: {
        files: ["less/**/*.less"],
        tasks: ["less", "postcss", "csso"]
      }
    },
    browserSync: {
      server: {
        bsFiles: {
          src: ["build/*.html", "build/css/*.css"]
        },
        options: {
          server: "build/",
          watchTask: true
        }
      }
    },
    /*Optimization*/
    csso: {
      style: {
        options: {
          report: 'gzip'
        },
        files: {
          'build/css/style.min.css': ['build/css/style.css']
        }
      },
    },
    posthtml: {
      options: {
        use: [
          require('posthtml-include')()
        ]
      },
      html: {
        files: [{
          expand: true,
          src: ['*.html'],
          dest: "build"
        }]
      }
    },
    /*Build*/
    concat: {
      dist: {
        src: ['js/*.js'],
        dest: 'build/js/main.js',
     },
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          src: ['*.html'],
          dest: "build"
        }]
      },
    },
    clean: {
      build: ["build"]
    },
    copy: {
      build: {
        files: [{
          expand: true,
          src: [
            "*.html",
            "fonts/**/*.{woff,woff2,ttf,eot}",
            "img/**",
            "js/**",
            "video/**"
          ],
          dest: "build"
        },
        {
         expand: true,
          src: [
            "apple-touch-icon*.*"
          ],
          dest: "build"
        }]
      }
    }
  });

  grunt.registerTask ("serve", [
    "browserSync",
    "watch"
  ])

  grunt.registerTask ("build", [
    "clean",
    "copy",
    "concat",
    "less",
    "postcss",
    "csso",
    "posthtml"
  ])

  grunt.registerTask ("js", [
    "concat",
    "uglify"
  ])
};
