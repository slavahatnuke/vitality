require('js-yaml');

var _ = require('underscore');
var async = require('async');
var exec = require('child_process').exec;

var Definition = require('./model/Definition');
var yml = require('./vitality.yml');

var map = [];

_(yml).each(function (config, name) {
    map.push(new Definition(name, config));
});

var final_print = function (defenition, next) {
    console.log('[' + defenition.status + ']', defenition.title);
    next();
}

var handleBuild = function (defenition, next) {

    console.log('[build]', defenition.title);
    console.log('>', defenition.build);

    exec(
        defenition.build,

        function (error, stdout, stderr) {

            defenition.build_output.error = stderr;
            defenition.build_output.out = stdout;

            defenition.built = true;

            if (error !== null) {

            } else {
                defenition.built_result = true;
            }

            next();

        });
}

var handleTest = function (defenition, next) {

    if (defenition.test) {
        exec(
            defenition.test,

            function (error, stdout, stderr) {

                defenition.test_output.error = stderr;
                defenition.test_output.out = stdout;

                defenition.tested = true;

                if (error !== null) {
                    defenition.status = 'fail';
                } else {
                    defenition.status = 'ok';
                    defenition.tested_result = true;
                }

                if (!defenition.tested_result && defenition.build && !defenition.built) {

                    handleBuild(defenition, function () {

                        if(defenition.built)
                        {
                            handleTest(defenition, next);
                        }
                        else {
                            final_print(defenition, next);
                        }

                    });
                }
                else {
                    final_print(defenition, next);
                }
            });
    }
    else {
        next();
    }
};


async.each(map, handleTest, function (err) {
    if (err)
        console.log(err);
});
