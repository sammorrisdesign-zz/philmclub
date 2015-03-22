module.exports = function(grunt) {
    require('jit-grunt')(grunt);

    grunt.initConfig({
        watch: {
          css: {
            files: '_scss/**/*.scss',
            tasks: ['sass']
          }
        },
        sass: {
          dist: {
            files: {
              'style.css' : '_scss/style.scss'
            }
          }
        },
        browserSync: {
          bsFiles: {
            src: ['style.css', 'index.html']
          },
          options: {
            watchTask: true,
            server: './'
          }
        }
    });

    grunt.registerTask('default', ['sass', 'browserSync', 'watch']);
};