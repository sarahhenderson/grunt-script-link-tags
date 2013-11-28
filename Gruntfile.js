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
                    openTag: '<!-- start template tags -->',
                    closeTag: '<!-- end template tags -->'
                },
                src: [
                    'tests/**/*.js'
                ],
                dest: 'tests/index.html'
            }
        }
    });

    grunt.registerTask('test', [
        'tags:test'
    ]);
};