'use strict';

module.exports = function(grunt) {

	// Helper function to load pre-defined grunt tasks
	require('load-grunt-tasks')(grunt);

	// Configures grunt tasks
	grunt.initConfig({

		clean: {
			dist: {
				files: [{
					dot: true,
					src: ['dist', 'tmp']
				}]
			}
		},

		handlebars: {
		    compile: {
                options: {
                    namespace: 'mmooc.templates',
                    processName: function(filePath) {
     				   return filePath.replace('src/templates/modules/', '').replace('src/addons/badges/templates/', '').replace(/\.hbs$/, '');
    				}
                },
		        files: {
		            "tmp/templates.js": ["src/templates/**/*.hbs"],
                    "tmp/badges_template.js": ["src/addons/badges/templates/*.hbs"]
		        }
		    }
		},

		less: {
	    	all: {
	        	options: {
	            	cleancss: true
	        	},
	        	files: {
	            	'tmp/mmooc-min.css': ['src/css/all.less'],
	            	'dist/badgesafe.css': ['src/addons/badges/css/all.less']
	        	}
	    	}
		},    

		concat: {
	        js: {
	            src: ['src/js/3party/*.js', 'tmp/templates.js', 'src/js/api/*.js', 'src/js/modules/*.js', 'src/js/settings.js', 'src/js/i18n.js', 'src/js/main.js', 'src/addons/canva_badges/js/*.js'],
	            dest: 'dist/mmooc-min.js'
	        },
            extras: {
                src: [
                        'node_modules/grunt-contrib-handlebars/node_modules/handlebars/dist/handlebars.min.js',// we need to embed handlebars here because it is not included in the iframe
                        'tmp/badges_template.js', 'src/addons/badges/js/*.js', 'src/js/modules/template.js', 'src/js/modules/util.js',
                        'src/js/i18n.js', 'src/js/settings.js'
                    ],
                dest: 'tmp/badges-min.js'
            },
    		uia: {
                src: ['src/js/i18nuia.js', 'src/js/settingsuia.js'],
                dest: 'dist/uia.js'
            },
    		mittdesign: {
                src: ['src/js/api/*.js', 'src/js/mittdesign.js'],
                dest: 'dist/mittdesign.js'
            },
    		mittdesign2: {
                src: ['src/js/api/*.js', 'src/js/mittdesign2.js'],
                dest: 'dist/mittdesign2.js'
            },
	    },

		uglify: {
		  dist: {
		    files: {
		      'dist/mmooc-min.js': ['tmp/mmooc.js']
		    }
		  }
		},

		replace: {
			production: {
				src: ['tmp/mmooc-min.css'],
				dest: 'dist/mmooc-min.css',
				replacements: 
				[{
					from: 'https://server',
					to: 'https://matematikk-mooc.github.io/frontend'
				}]
			},
			productioncustom: {
				src: ['tmp/mmooc-min.css'],
				dest: 'dist/mmooc-min-custom.css',
				replacements: 
				[
				{
					from: 'https://server/bitmaps/mmooc-logo.png',
					to: '/custom/bitmaps/mmooc-logo.png'
				},
				{
					from: 'https://server/bitmaps/mmooc-logo@2x.png',
					to: '/custom/bitmaps/mmooc-logo@2x.png'
				},
				{
					from: 'https://server',
					to: 'https://matematikk-mooc.github.io/frontend'
				}]
			},
			development: {
				src: ['tmp/mmooc-min.css'],
				dest: 'dist/mmooc-min-dev.css',
				replacements: [{
					from: 'https://server',
					to: 'http://localhost:9000'
				}]
			},
            production_badge: {
                src: ['tmp/badges-min.js'],
                dest: 'dist/badgesafe.js',
                replacements: [{
                    from: 'https://server',
                    to: 'https://matematikk-mooc.github.io/frontend'
                }]
            },
            development_badge: {
                src: ['tmp/badges-min.js'],
                dest: 'dist/badges-dev.js',
                replacements: [{
                    from: 'https://server',
                    to: 'http://localhost:9000'
                }]
            }
		},

		copy: {
			main: {
				files: [
					{expand: true, src: ['bitmaps/*'], cwd: 'src/', dest: 'dist/'},
					{expand: true, src: ['vector_images/*'], cwd: 'src/', dest: 'dist/'}
				]
			}
		},

		connect: {
			dist: {
				options: {
					port: 9000,
					base: 'dist',
					hostname: 'localhost',
					open: true
				}
			}, test: {
                options: {
                    port: 9988,
                    base: [
                        'spec',
                        'src/js/api',
                        'src/js/modules',
                        'src/js'
                    ]
                }
            }
		},

		watch: {
			dist: {
				files: [
				'src/css/**/*.less',
				'src/js/**/*.js',
                'src/addons/badges/js/*.js',
                'src/addons/badges/css/*.less'
				],
				tasks: ['clean', 'build']
			}
		},

        karma: {
            unitTest: {
                configFile: 'test/js/karma.conf.js',
                autoWatch: false,
                singleRun: true,
                browsers: process.env.KARMA_BROWSER == null ? ['Firefox', 'Chrome'] : ['Firefox', 'Chrome', '<%= extraBrowser %>']
            }
        }

	});

	grunt.registerTask('make', [
		'handlebars',
		'concat',
		//'uglify',
		'less',
		'copy',
		'replace:production',
		'replace:productioncustom',
		'replace:development',
		'replace:production_badge',
		'replace:development_badge'
		]);

	grunt.registerTask('runTest', [
		'connect:test',
    'karma:unitTest'
	]);

	grunt.registerTask('test', [
    'clean',
    'make',
    'runTest'
  ]);

	grunt.registerTask('build', [
		'make',
		'runTest'
	]);

	grunt.registerTask('serve', [
		'clean',
    'make',
    'connect',
    'watch'
  ]);

	grunt.registerTask('default', [
		'clean',
		'make'
	]);



};
