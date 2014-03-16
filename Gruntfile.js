module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    jshint: {
      src: {
        src: ["jbone.widget.js"],
        options: {
          jshintrc: ".jshintrc"
        }
      }
    },
    mocha: {
      src: {
        options: {
          reporter: 'Spec',
          run: true
        },
        src: ['test/tests.html']
      }
    },
    watch: {
      files: ["<%= jshint.src.src %>"],
      tasks: "dev"
    }
  });

  // Load grunt tasks from NPM packages
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-mocha");

  // Short list as a high frequency watch task
  grunt.registerTask("test", ["jshint", "mocha"]);
  grunt.registerTask("dev", ["test"]);

  // Default grunt
  grunt.registerTask("default", ["dev"]);

};
