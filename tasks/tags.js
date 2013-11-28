'use strict';

module.exports = function (grunt) {
    // format for all support file inputs
    // that.files is an array of destination files to run task for
        // file.dest  - file to add tags to
        // file.src   - array of files to include tags for

    // used to calculate relative paths
    var path = require('path');

    // used to get line ending for users operating system
    var os = require('os');

    /**
     * process a script or link template
     */
    function processTemplate (template, data) {
        return grunt.template.process(template, {data: data});
    }

    //
    // main grunt task for tags
    //
    grunt.registerMultiTask('tags', 'Dynamically add script and link tags to html file', function () {
        var that = this;
        var options = that.options();
        var scriptTemplate = options.scriptTemplate || '<script src="<%= path %>"></script>';
        var linkTemplate = options.linkTemplate || '<link href="<%= path %>"/>';

        function modifyFile(destFile, srcFiles) {

            // grunt.file.read provides check that destFile actually exists
            var destFileContents = grunt.file.read(destFile);

            // store the directory path for the destination file
            // this is used to calculate relative location for srcFiles
            var base = path.dirname(destFile);

            // store string to insert between template comments
            var textToAdd = '';

            // for each matched file, add a script tag
            srcFiles.forEach(function (file) {
                var relativePath = path.relative(base, file);

                if (path.extname(relativePath) === '.js') {
                    textToAdd += processTemplate(scriptTemplate, {path: relativePath}) + os.EOL;
                } else if (path.extname(relativePath) === '.css') {
                    textToAdd += processTemplate(linkTemplate, {path: relativePath}) + os.EOL;
                }
            });

            // get locations of template tags
            // used to verify that the destination file contains valid template tags
            var openTagLocation = destFileContents.indexOf(options.openTag);
            var closeTagLocation = destFileContents.indexOf(options.closeTag);

            // verify template tags exist and in logic order
            if (closeTagLocation < openTagLocation || openTagLocation === -1 || closeTagLocation === -1) {
                grunt.fail.fatal('invalid template tags in ' + destFile);
            }

            // split by opening tag and grab all content before it
            var beginning = destFileContents.split(options.openTag)[0];

            // split by closing tag, storing all content after it
            var end = destFileContents.split(options.closeTag)[1];

            var finalFile = beginning +
                options.openTag + os.EOL +
                textToAdd +
                options.closeTag +
                end;

            grunt.file.write(destFile, finalFile);
        }

        // for each destination file
        this.files.forEach(function (file) {
            modifyFile(file.dest, file.src);
        });
    });
};