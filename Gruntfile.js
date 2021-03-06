/**
 * This file is used to build ng-handsontable from `src/*`
 *
 * Installation:
 * 1. Install Grunt CLI (`npm install -g grunt-cli`)
 * 1. Install Grunt 0.4.0 and other dependencies (`npm install`)
 *
 * Build:
 * Execute `grunt` from root directory of this directory (where Gruntfile.js is)
 * To execute automatically after each change, execute `grunt --force default watch`
 *
 * Result:
 * building ng-handsontable will create files:
 *  - dist/ng-handsontable.js
 *  - dist/ng-handsontable.min.js
 *
 * See http://gruntjs.com/getting-started for more information about Grunt
 */
module.exports = function (grunt) {
  var myBanner = '/**\n' +
    ' * <%= pkg.name %> <%= pkg.version %>\n' +
    ' * \n' +
    ' * Copyright 2012-2015 Marcin Warpechowski\n' +
    ' * Copyright 2017 Richard Nemec\n' +
    ' * Licensed under the MIT license.\n' +
    ' * https://github.com/rnemec/ng-handsontable\n' +
    ' * Date: <%= (new Date()).toString() %>\n' +
    '*/\n\n';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        banner: myBanner
      },
      new: {
        src: [
          'src/ie-shim.js',
          'src/ng-handsontable.js',
          'src/services/*.js',
          'src/directives/*.js'
        ],
        dest: 'dist/ng-handsontable.js'
      }
    },

    uglify: {
      options: {
        banner: myBanner
      },
      "dist/ng-handsontable.min.js": ["dist/ng-handsontable.js"]
    },

    jshint: {
      options: {
        jshintrc: true
      },
      files:['src/**/*.js', 'src/*.js']
    },

    jscs: {
      main: {
        files: {
          src: ['src/**/*.js', 'src/*.js']
        }
      },
      options: {
        config: '.jscsrc',
        esnext: true,
        verbose: true
      }
    },

    watch: {
      files: ['src/**/*.js'],
      tasks: ['concat', 'uglify']
    },

    browserify: {
      demoApp: {
        src: [
          './demo/js/**/*.js'
        ],
        dest: './demo/build/app.js',
        options: {
          alias: [
            './demo/js/demos.js:demos',
            './demo/js/modules.js:modules',
            './demo/js/routing.js:routing'
          ],
          transform: [
            ['browserify-replace', {
              replace: [
                { from: /@@version/, to: '<%= pkg.version %>' }
              ]
            }
            ]
          ]
        }
      },
      demoAppWatch: {
        src: [
          './demo/js/**/*.js'
        ],
        dest: './demo/build/app.js',
        options: {
          alias: [
            './demo/js/demos.js:demos',
            './demo/js/modules.js:modules',
            './demo/js/routing.js:routing'
          ],
          watch: true,
          keepAlive: true
        }
      }
    }
  });

  grunt.registerTask('build', ['jscs', 'jshint', 'concat', 'uglify']);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('watch-demo-app', ['browserify:demoAppWatch']);
  grunt.registerTask('build-demo-app', ['browserify:demoApp']);
  grunt.registerTask('build-release', ['build', 'build-demo-app']);

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jscs');
};
