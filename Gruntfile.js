module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		exec: {
			gitclone: {
				command: 'git clone https://github.com/Art4/Ged.git src'
			},
			bumpversion: {
				command: function() {
					var pkg = grunt.file.readJSON('src/package.json');
					return 'echo '+pkg.version+'> latest_release';
				}
			}
		},
		compress: {
			main: {
				options: {
					mode: 'zip',
					archive: function () {
						var pkg = grunt.file.readJSON('src/package.json');
						return 'dist/'+pkg.name+'_v'+pkg.version+'/'+pkg.name+'.gadget'
					}
				},
				files: [
					{expand: true, cwd: 'src/', src: ['**/*'], dest: '/'}
				]
			}
		},
		markdown: {
			changelog: {
				files: [
					{
						expand: true,
						src: 'CHANGELOG.md',
						cwd: 'src/',
						dest: 'docs/',
						ext: '.html'
					},
					{
						expand: true,
						src: 'README.md',
						cwd: 'src/',
						dest: 'docs/',
						ext: '.html'
					}
				],
				options: {
				}
			}
		}
	});

	// Load the plugin that provides the "exec" task.
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-markdown');

	// Default task(s).
	grunt.registerTask('bower', 'install the frontend dependencies', function() {
		var exec = require('child_process').exec;
		var cb = this.async();
		//exec('bower install', {}, function(err, stdout, stderr) {
		exec('bower install', {}, function(err, stdout, stderr) {
			console.log(stdout);
			cb();
		});
	});

	// Build
	grunt.registerTask('build', ['compress']);

	// Deployment
	grunt.registerTask('deploy', ['compress', 'exec:bumpversion', 'markdown:changelog']);

	// Init
	grunt.registerTask('init', ['exec:gitclone']);
};
