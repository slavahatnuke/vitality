var yaml = require('js-yaml');
var fs   = require('fs');

var Class = require('define-class');

var _ = require('underscore');
var path = require('path');

var Command = require('./command/Command');
var ProfileBuilder = require('./builder/ProfileBuilder');
var request = require('request');

var Vitality = Class({

    log: false,
    profileBuilder: false,

    repository: 'https://raw.github.com/slavahatnuke/vitalities/master/',

    init: function(log){
        this.log = log ? log : console.log;
        this.profileBuilder = new ProfileBuilder();
    },
    print: function (defenition, next) {
        this.log('[' + defenition.status + ']', defenition.title);
        next();
    },

    runProfile: function (profile, next) {
        profile.each(_(this.runTest).bind(this), function () {
            profile.hasFails(next);
        });
    },
    isLink: function (file) {
        return /\@\w*\//i.test(file);
    },
    prepareFile: function (file) {

        if(!/(\.yml)$/i.test(file))
        {
            file += '.yml';
        }

        if(this.isLink(file))
        {
            return file.replace('@/', this.repository);
        }
        else
        {
            return path.resolve(file);
        }
    },

    prepareData: function (file, next) {

        var path = this.prepareFile(file);

        if (this.isLink(file)) {

            this.log('[load]', path);

            request(path, function (err, response, body) {

                if(err) return next(err);

                if (response.statusCode == 200) {
                    next(err, yaml.safeLoad(body));
                }
                else
                {
                    next(new Error('Could not load URL: ' + path));
                }
            });
        }
        else
        {
            if(!fs.existsSync(path)) return next(new Error('File is not exist: ' + path));

            var data = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
            next(null, data);
        }

    },
    run: function (file, next) {
        this.prepareData(file, function (err, data) {
            if (err) return next(err);
            this.runProfile(this.profileBuilder.build(data), next);
        }.bind(this));
    },
    prepareCommand: function(command)
    {
        if(typeof command == 'string')
        {
            return command;
        }
        else
        {
            var result = [];

            _(command).each(function (cmd) {
                result.push(cmd);
            });

            return result.join(' && ');
        }
    },

    runIf: function (defenition, next) {

        var self = this;

        var command = new Command(this.prepareCommand(defenition.if));

        command.run(function () {

            defenition.tested = true;

            var failed = command.code;

            if(defenition.if_not)
            {
                failed = !failed;
            }

            if (failed) {
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
                        self.print(defenition, next);
                    }

                });
            }
            else {
                self.print(defenition, next);
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

        var command_line = this.prepareCommand(defenition.else);

        console.log('>', command_line);
        var command = new Command(command_line, true);

        command.run(function () {

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