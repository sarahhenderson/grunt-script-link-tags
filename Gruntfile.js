'use strict';

module.exports = function(grunt) {

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // default test task
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        tags: {
            options: {
                //
            },
            test: {
                options: {
                    scriptTemplate: '<script type="text/javascript" src="{{ path }}"></script>',
                    linkTemplate: '<link rel="stylesheet" href="{{path}}"/>',
                    openTag: '<!-- start auto template tags -->',
                    closeTag: '<!-- end auto template tags -->'
                },
                src: [
                    'tests/**/*.js',
                    'tests/**/*.css'
                ],
                dest: 'tests/index.html'
            }
        }
    });

    grunt.registerTask('test', [
        'tags:test'
    ]);
};