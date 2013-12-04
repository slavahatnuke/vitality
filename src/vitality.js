require('js-yaml');

var Class = require('define-class');

var _ = require('underscore');
var async = require('async');
var exec = require('child_process').exec;
var path = require('path');

var Definition = require('./model/Definition');
var Profile = require('./model/Profile');


var print_definition = function (defenition, next) {
    console.log('[' + defenition.status + ']', defenition.title);
    next();
}

var Vitality = Class({

    init: function(){

    },
    handleFile: function(file)
    {

        console.log('[run]', file);

        var data = require(path.resolve(file));

        var definitions = [];

        _(data).each(function (config, name) {
            definitions.push(new Definition(name, config));
        });

        async.eachSeries(definitions, _(this.handleTest).bind(this), function (err) {
            if (err)
            {
                console.log(err);
            }
        });
    },
    handleTest: function (defenition, next) {

        var self = this;

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

                        self.handleBuild(defenition, function () {

                            if (defenition.built) {
                                self.handleTest(defenition, next);
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

    handleBuild: function (defenition, next) {

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

});

module.exports = Vitality;