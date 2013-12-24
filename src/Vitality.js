var yaml = require('js-yaml');
var fs   = require('fs');

var Class = require('define-class');

var _ = require('underscore');
var path = require('path');

var Command = require('./command/Command');
var ProfileBuilder = require('./builder/ProfileBuilder');

var Vitality = Class({

    log: false,
    profileBuilder: false,

    init: function(log){
        this.log = log ? log : console.log;
        this.profileBuilder = new ProfileBuilder();
    },
    printDefinition: function (defenition, next) {
        this.log('[' + defenition.status + ']', defenition.title);
        next();
    },

    runProfile: function (profile, next) {
        profile.each(_(this.runTest).bind(this), function () {
            profile.hasFails(next);
        });
    },
    run: function (file, next) {

        var data = yaml.safeLoad(
            fs.readFileSync(path.resolve(file), 'utf8')
        );

        this.runProfile(this.profileBuilder.build(data), next);
    },
    runIf: function (defenition, next) {

        var self = this;

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

                self.runElse(defenition, function () {

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
    },
    runTest: function (defenition, next) {

        var self = this;

        if (defenition.if) {
            this.runIf(defenition, next);
        }
        else {
            next();
        }
    },

    runElse: function (defenition, next) {

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