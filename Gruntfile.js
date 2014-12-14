module.exports = function(grunt) {
  	grunt.initConfig({
	  concat: {
		jCommonPlugins: {}
	}
	});
  grunt.file.expand('./../../node_modules/grunt-*/tasks').forEach(grunt.loadTasks);
  require('./../../node_modules/grunt-config-merge')(grunt);
  require('../../grunt/global/grunt-default.js')(grunt);
};