//
// Written By Andrew Mead
// github.com/andrewjmead
//
'use strict';

module.exports = function (grunt) {
    var path = require('path');
    var os = require('os');
    var EOL = os.EOL; // end of line for operating system

    /**
     * compile a template with provided data
     */
    function processTemplate (template, data) {
        return grunt.template.process(template, {data: data});
    }

    /**
     * generate a template tag for provided file
     */
    function generateTag (relativePath, templates) {
        var ext = path.extname(relativePath);

        if (ext === '.js') {
            return processTemplate(templates.scriptTemplate, {path: relativePath}) + EOL;
        } else if (ext === '.css') {
            return processTemplate(templates.linkTemplate, {path: relativePath}) + EOL;
        } else {
            return ''
        }
    }

    //
    // tags grunt task
    //
    grunt.registerMultiTask('tags', 'Dynamically add script and link tags to html file', function () {
        var that = this;
        var options = that.options();
        var scriptTemplate = options.scriptTemplate || '<script src="{{ path }}"></script>';
        var linkTemplate = options.linkTemplate || '<link href="{{ path }}"/>';
        var openTag = options.openTag || '<!-- start auto template tags -->';
        var closeTag = options.closeTag || '<!-- start auto template tags -->';

        /**
         * @kludge should not have to hack around for templates
         */
        scriptTemplate = scriptTemplate.replace('{{', '<%=').replace('}}', '%>')
        linkTemplate = linkTemplate.replace('{{', '<%=').replace('}}', '%>')

        function modifyFile(destFile, srcFiles) {

            // grunt.file.read provides check that destFile actually exists
            var destFileContents = grunt.file.read(destFile);

            // get locations of template tags
            // used to verify that the destination file contains valid template tags
            var openTagLocation = destFileContents.indexOf(openTag);
            var closeTagLocation = destFileContents.indexOf(closeTag);

            // verify template tags exist and in logic order
            if (closeTagLocation < openTagLocation || openTagLocation === -1 || closeTagLocation === -1) {
                grunt.fail.fatal('invalid template tags in ' + destFile);
            }

            // store the directory path for the destination file
            // this is used to calculate relative location for srcFiles
            var base = path.dirname(destFile);

            // store string to insert between template comments
            var textToAdd = '';

            // for each matched file, add a script tag
            srcFiles.forEach(function (srcFile) {
                var relativePath = path.relative(base, srcFile);
                var tag = generateTag(relativePath, {
                    scriptTemplate: scriptTemplate,
                    linkTemplate: linkTemplate
                });

                textToAdd += tag;
            });

            // split by opening tag and grab all content before it
            var beginning = destFileContents.split(openTag)[0];

            // split by closing tag, storing all content after it
            var end = destFileContents.split(closeTag)[1];

            var finalFile = beginning +
                openTag + EOL +
                textToAdd +
                closeTag +
                end;

            grunt.file.write(destFile, finalFile);
        }

        // for each destination file
        this.files.forEach(function (file) {
            modifyFile(file.dest, file.src);
        });
    });
};