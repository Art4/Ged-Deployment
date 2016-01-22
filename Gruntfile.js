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
					template: 'docs/template/template.html',
					preCompile: function(src, context) {
						// Replace License und Chandlog link
						src = src.split('](LICENSE)').join('](https://github.com/Art4/Ged/blob/master/LICENSE)');
						src = src.split('](CHANGELOG.md)').join('](CHANGELOG.html)');
						return src;
					},
					postCompile: function(src, context) {
						// Highlight navbar items
						if ( context.title === 'Readme' ) {
							src = src.replace('<li><a href="README.html">Readme</a></li>', '<li class="active"><a href="README.html">Readme</a></li>');
						}
						else if ( context.title === 'Changelog' ) {
							src = src.replace('<li><a href="CHANGELOG.html">Changelog</a></li>', '<li class="active"><a href="CHANGELOG.html">Changelog</a></li>');
						}
						return src;
					},
					templateContext: {},
					contextBinder: true,
					contextBinderMark: '@@@'
				}
			}
		}
	});

	// Load the plugins
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-markdown');

	// Tasks:
	// Build
	grunt.registerTask('build', ['compress']);

	// Deployment
	grunt.registerTask('deploy', ['compress', 'exec:bumpversion', 'markdown:changelog']);

	// Init
	grunt.registerTask('init', ['exec:gitclone']);
};
