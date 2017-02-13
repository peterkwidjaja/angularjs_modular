'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates'
  });

  var serveStatic = require('serve-static');

  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  grunt.initConfig({

    angularapp: appConfig,

    // Watches files for changes and runs tasks based on specific files
    watch: {
      options: {
        event: ['added', 'deleted', 'changed']
      },
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: [
          '<%= angularapp.app %>/*.js',
          '<%= angularapp.app %>/modules/**/*.js'
        ],
        tasks: ['newer:jshint:all', 'newer:jscs:all','prepareModules','concat:modules'],
        options: {
          livereload: true
        }
      },
      // jsTest: {
      //   files: ['test/spec/**/*.js'],
      //   tasks: ['newer:jshint:test', 'newer:jscs:test', 'karma']
      // },
      lessmodfile: {
        files: ['<%= angularapp.app %>/modules/**/*.less'],
        tasks: ['concat:styles'],
        options: {
          event: ['added', 'deleted', 'changed']
        }
      },
      lessfile: {
        files: ['<%= angularapp.app %>/assets/styles/**/*.less'],
        tasks: ['less']
      },
      styles: {
        files: ['<%= angularapp.app %>/assets/styles/**/*.css'],
        tasks: ['newer:copy:styles', 'postcss']
      },
      images: {
        files: ['<%= angularapp.app %>/modules/*/images/**/*.{png,jpg,jpeg,gif,webp,svg}'],
        tasks: ['prepareModules','newer:copy:images']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          '<%= angularapp.app %>/index.html',
          '<%= angularapp.app %>/modules/**/*.html',
          '<%= angularapp.app %>/assets/styles/main.css',
          '<%= angularapp.app %>/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= angularapp.dist %>/{,*/}*',
            '!<%= angularapp.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp',
      assets: {
        src: [
          '<%= angularapp.app %>/assets/images/*',
          '<%= angularapp.app %>/assets/js/*'
        ]
      }
    },

    concat: {
      // concat:styles concats module specific files into modules.less in assets folder
      styles: {
        src: [
          '<%= angularapp.app %>/modules/**/*.less'
        ],
        dest: '<%= angularapp.app %>/assets/styles/modules.less'
      }
    },

    connect: {
      server: {
        options: {
          keepalive: true,
          port: 9000,
          hostname: 'localhost',
          livereload: true,
          open: true,
          middleware: function(connect) {
            return [
              serveStatic(appConfig.app),
              connect().use('/bower_components', serveStatic('./bower_components'))
            ];
          }
        }
      }
    },

    concurrent: {
      server : ['connect', 'watch'],
      dist: ['copy:styles', 'imagemin', 'svgmin'],
      test: ['copy:styles'],
      options: {
        logConcurrentOutput: true
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= angularapp.app %>',
          dest: '<%= angularapp.dist %>',
          src: [
            '*.{ico,png,txt}',
            '*.html',
            'assets/images/{,*/}*.{webp}',
            'assets/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/assets/images',
          dest: '<%= angularapp.dist %>/assets/images',
          src: ['generated/*']
        }]
      },
      // prestyles: {
      //   expand: true,
      //   cwd: '<%= angularapp.app %>/modules',
      //   src: '**.*.less',
      //   dest: ''
      // },
      styles: {
        expand: true,
        cwd: '<%= angularapp.app %>/assets/styles',
        dest: '.tmp/assets/styles/',
        src: '{,*/}*.css'
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: 0,
      }
    },

    filerev: {
      dist: {
        src: [
          '<%= angularapp.dist %>/assets/js/**/*.js',
          '<%= angularapp.dist %>/assets/styles/**/*.css',
          '<%= angularapp.dist %>/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= angularapp.dist %>/assets/fonts/*',
        ]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeComments: true
        },
        files: [{
          expand: true,
          cwd: '<%= angularapp.dist %>',
          src: ['*.html'],
          dest: '<%= angularapp.dist %>'
        }]
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= angularapp.app %>/assets/images',
          src: '**/*.{png,jpg,jpeg,gif}',
          dest: '<%= angularapp.dist %>/assets/images'
        }]
      }
    },

    // Make sure code styles are up to par
    jscs: {
      options: {
        config: '.jscsrc'
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= angularapp.app %>/modules/**/*.js'
        ]
      },
      test: {
        src: ['test/spec/**/*.js']
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= angularapp.app %>/modules/**/*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/**/*.js']
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    less: {
      development: {
        options: {
          cleancss: true
        },
        files: {
          '<%= angularapp.app %>/assets/styles/main.css' : '<%= angularapp.app %>/assets/styles/main.less'
        }
      },
      production: {
        options: {
          cleancss: true
        },
        files: {
          '<%= angularapp.app %>/assets/styles/main.css' : '<%= angularapp.app %>/assets/styles/main.less'
        }
      }
    },

    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    ngtemplates: {
      dist: {
        options: {
          module: 'hubble',
          htmlmin: '<%= htmlmin.dist.options %>',
          usemin: 'assets/js/scripts.js'
        },
        cwd: '<%= angularapp.app %>',
        src: 'modules/**/*.html',
        dest: '.tmp/templateCache.js'
      }
    },

    postcss: {
      options: {
        processors: [
          require('autoprefixer')({browsers: 'last 1 version'})
        ]
      },
      server: {
        options: {
          map: true
        },
        files: [{
          expand: true,
          cwd: '<%= angularapp.app %>/assets/styles/',
          src: '{,*/}*.css',
          dest: '<%= angularapp.app %>/assets/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/assets/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/assets/styles/'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= angularapp.app %>/assets/images',
          src: '**/*.svg',
          dest: '<%= angularapp.dist %>/assets/images'
        }]
      }
    },

    useminPrepare: {
      html: '<%= angularapp.app %>/index.html',
      options: {
        dest: '<%= angularapp.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglify'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    usemin: {
      html: ['<%= angularapp.dist %>/{,*/}*.html'],
      css: ['<%= angularapp.dist %>/assets/styles/{,*/}*.css'],
      js: ['<%= angularapp.dist %>/assets/js/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= angularapp.dist %>',
          '<%= angularapp.dist %>/assets/images',
          '<%= angularapp.dist %>/assets/styles'
        ],
        patterns: {
          js: [
            [/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']
          ]
        }
      }
    },

    wiredep: {
      app: {
        src: ['<%= angularapp.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      styles: {
        src: ['<%= angularapp.app %>/assets/styles/vendor.less','<%= angularapp.app %>/index.html']
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath:  /\.\.\//,
        fileTypes:{
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
            detect: {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      }
    }
  });

  grunt.registerTask('serve', 'Compile and start a connect web server', function() {
    grunt.task.run([
      'clean:server',
      'clean:assets',
      'wiredep',
      'prepareModules',
      'concat:modules',
      'concat:styles',
      'copy:images',
      'less:development',
      'concurrent:server',
      'postcss:server'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'clean:assets',
    'wiredep',
    'prepareModules',
    'concat:modules',
    'concat:styles',
    'copy:images',
    'less:production',
    'useminPrepare',
    'concurrent:dist',
    'postcss:dist',
    'ngtemplates',
    'concat:generated',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'wiredep',
    'less',
    'concurrent:test',
    'postcss',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'jscs',
    //'prepareModules',
    //'test',
    'build'
  ]);

  grunt.registerTask('prepareModules', 'Find and prepare modules for concatenation', function() {
    var concat = grunt.config.get('concat') || {};
    concat.modules = {
      files: {}
    };

    var copy = grunt.config.get('copy') || {};
    copy.images = {
      files: []
    };

    grunt.file.expand('app/modules/*').forEach(function(dir){
      var dirName = dir.substr(dir.lastIndexOf('/')+1);
      var dest = 'app/assets/js/'+dirName+'.js';
      concat.modules.files[dest] = [dir+'/*.module.js',dir+'/*.route.js',dir+'/**/*.js'];

      var imgDest = 'app/assets/images/'+dirName;
      var tempImg = {
        expand: true,
        cwd: dir+'/images',
        dest: imgDest,
        src: ['**/*']
      };
      copy.images.files.push(tempImg);
    });
    grunt.config.set('concat', concat);
    grunt.config.set('copy', copy);

  });
};
