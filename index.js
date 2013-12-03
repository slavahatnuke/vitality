require('js-yaml');

var _ = require('underscore');
var async = require('async');
var exec = require('child_process').exec;
var pkg = require('./package');
var path = require('path');

var Definition = require('./model/Definition');

var print_definition = function (defenition, next) {
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

                        if (defenition.built) {
                            handleTest(defenition, next);
                        }
                        else {
                            print_definition(defenition, next);
                        }

                    });
                }
                else {
                    print_definition(defenition, next);
                }
            });
    }
    else {
        next();
    }
};

function run(file) {

    var data = require(path.resolve(file));

    var definitions = [];

    _(data).each(function (config, name) {
        definitions.push(new Definition(name, config));
    });

    async.each(definitions, handleTest, function (err) {
        if (err)
        {
            console.log(err);
        }
    });

}


var program = require('commander');

program
    .version(pkg.version)
    .usage('[options] <file ...>')
    .option('-v, --verbose', 'verbose mode');

program
    .command('*')
    .description('handle <file ...>')
    .action(function (env) {
        run(env);
    });

program.parse(process.argv);

if(!program.args.length)
{
    console.log( program.helpInformation() );
}


