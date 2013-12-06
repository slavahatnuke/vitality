require('js-yaml');

var Class = require('define-class');

var _ = require('underscore');
var path = require('path');

var Command = require('./command/Command');
var Definition = require('./model/Definition');
var Profile = require('./model/Profile');


var Vitality = Class({

    init: function () {

    },

    printDefinition: function (defenition, next) {
        console.log('[' + defenition.status + ']', defenition.title);
        next();
    },

    constructProfile: function (data) {

        var profile = new Profile();

        _(data).each(function (config, name) {
            profile.add(new Definition(name, config));
        });

        return profile;
    },

    runProfile: function (profile) {

        var next = function () {

            profile.each(function (definition) {
                if (definition.status == 'fail')
                    process.exit(1);
            });

            process.exit(0);
        };

        profile.each(_(this.runTest).bind(this), next);
    },
    run: function (file) {

        var data = require(path.resolve(file));
        var profile = this.constructProfile(data);

        this.runProfile(profile);
    },
    runTest: function (defenition, next) {

        var self = this;

        if (defenition.if) {

            var command = new Command(defenition.if);

            command.run(function () {

                defenition.test_output.error = command.stderr;
                defenition.test_output.out = command.stdout;

                defenition.tested = true;

                if (command.code) {
                    defenition.status = 'fail';
                } else {
                    defenition.status = 'ok';
                    defenition.tested_result = true;
                }

                if (!defenition.tested_result && defenition.else && !defenition.built) {

                    self.runBuild(defenition, function () {

                        if (defenition.built) {
                            self.runTest(defenition, next);
                        }
                        else {
                            self.printDefinition(defenition, next);
                        }

                    });
                }
                else {
                    self.printDefinition(defenition, next);
                }
            });
        }
        else {
            next();
        }
    },

    runBuild: function (defenition, next) {

        console.log('[build]', defenition.title);
        console.log('>', defenition.else);

        var command = new Command(defenition.else, true);

        command.run(function () {

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