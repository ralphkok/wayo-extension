module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        replace: {
            dist: {
                src: ['js/config.js'],
                overwrite: true,
                replacements: [{
                    from: /debug:(.*?),/g,
                    to: 'debug: false,'
                }]
            },
            dev: {
                src: ['js/config.js'],
                overwrite: true,
                replacements: [{
                    from: /debug:(.*?),/g,
                    to: 'debug: true,'
                }]
            }
        },

        compass: {
            options: {
                config: 'config.rb',
                force: true
            },
            dist: {
                options: {
                    outputStyle: 'compressed',
                    environment: 'production'
                }
            },
            dev: {
                options: {
                    outputStyle: 'expanded',
                    environment: 'development'
                }
            }
        },

        clean: ['js/build'],

        handlebars: {
            compile: {
                options: {
                    amd: 'handlebars.runtime',
                    namespace: false
                },
                expand: true,
                cwd: 'templates',
                src: ['**/*.hbs'],
                dest: 'js/build/templates',
                ext: '.js'
            }
        },

        requirejs: {

            options: {
                findNestedDependencies: true,
                generateSourceMaps: true,
                preserveLicenseComments: false,
                optimize: 'uglify2',
                baseUrl: 'js/app/',
                uglify2: {
                    output: {
                        beautify: false,
                        max_line_len: 1000
                    },
                    compress: {
                        sequences: false,
                        side_effects: false,
                        global_defs: { DEBUG: false },
                        drop_console: true
                    },
                    warnings: true,
                    mangle: false
                },
                onBuildWrite: function (moduleName, path, contents) {
                    return '/*! Built on: ' + new Date() + ' */\n' + contents;
                }
            },

            main: {
                options: {
                    mainConfigFile: 'js/app/main-config.js',
                    name: 'main-config',
                    out: 'js/build/main.min.js'
                }
            }
        },

        watch: {
            styles: {
                files: ['sass/**/*.scss'],
                tasks: ['compass:dev']
            },
            templates: {
                files: ['templates/**/*.hbs'],
                tasks: ['clean', 'handlebars']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-text-replace');

    grunt.registerTask('dist', ['replace:dist', 'compass:dist', 'clean', 'handlebars', 'requirejs']);
    grunt.registerTask('dev', ['replace:dev', 'compass:dev', 'clean', 'handlebars']);
    grunt.registerTask('default', ['dev', 'watch']);
};
