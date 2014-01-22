module.exports = function(grunt) {
  
  grunt.initConfig({
    watch: {
      files: ['src/*.js'],
      tasks: ['browserify']
    },
    browserify: {
      build: {
        files: {
          'bin/game.js': ['src/game.js']
        }
      },
      
      options: {
        debug: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  
  grunt.registerTask('default', ['watch']);
}
