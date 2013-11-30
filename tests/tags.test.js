//
// nodeunit tests for tags task
//

var grunt = require('grunt');

module.exports = {
    setUp: function (callback) {
        this.foo = 'bar';
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    allTags: function (test) {
        test.expect(1);

        var expect = grunt.file.read('tests/expect/all-tags.html');
        var result = grunt.file.read('tests/results/all-tags.html');
        test.equal(expect, result, 'should process a basic tags task');

        test.done();
    }
};