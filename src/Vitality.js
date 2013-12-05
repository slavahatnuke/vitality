require('js-yaml');

var Class = require('define-class');

var _ = require('underscore');
var async = require('async');
var path = require('path');

var Command = require('./command/Command');

var Definition = require('./model/Definition');
var Profile = require('./model/Profile');


var print_definition = function (defenition, next) {
    console.log('[' + defenition.status + ']', defenition.title);
    next();
}

var Vitality = Class({

    init: function(){

    },
    run: function(file)
    {

        console.log('[run]', file);

        var data = require(path.resolve(file));

        var definitions = [];

        _(data).each(function (config, name) {
            definitions.push(new Definition(name, config));
        });

        async.eachSeries(definitions, _(this.runTest).bind(this), function(){

            _(definitions).each(function (definition) {
                if(definition.status == 'fail')
                    process.exit(1);
            });

            process.exit(0);

        });



    },
    runTest: function (defenition, next) {

        var self = this;

        if (defenition.test) {

            var command = new Command(defenition.test);

            command.run(function(){

                    defenition.test_output.error = command.stderr;
                    defenition.test_output.out = command.stdout;

                    defenition.tested = true;

                    if (command.code) {
                        defenition.status = 'fail';
                    } else {
                        defenition.status = 'ok';
                        defenition.tested_result = true;
                    }

                    if (!defenition.tested_result && defenition.build && !defenition.built) {

                        self.runBuild(defenition, function () {

                            if (defenition.built) {
                                self.runTest(defenition, next);
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
    },

    runBuild: function (defenition, next) {

        console.log('[build]', defenition.title);
        console.log('>', defenition.build);

        var command = new Command(defenition.build, true);

        command.run(function(){

            defenition.build_output.error = command.stderr;
            defenition.build_output.out = command.stdout;

            defenition.built = true;

            if (command.code) {

            } else {
                defenition.built_result = true;
            }

            next(command.error);

        });
    }

});

module.exports = Vitality;