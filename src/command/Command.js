var Class = require('define-class');
var exec = require('child_process').exec

var Command = Class({

        command: false,
        stdio: false,
        process: false,

        error: false,
        stdout: false,
        stderr: false,

        result: '',
        code: 0,

        init: function (command, stdio) {
            this.command = command;
            this.stdio = stdio;
            this.error = null;
        },

        run: function (next) {
            var self = this;

            this.process = exec(this.command,
                function (error, stdout, stderr) {

                    self.error = error;

                    self.stdout = stdout;
                    self.stderr = stderr;

                    self.result = '' + stdout + stderr;

                    if (error) {
                        self.code = error.code;
                    }

                    if (next)
                        next(error, self);
                });

            if (this.stdio) {
                this.process.stdout.pipe(process.stdout);
                this.process.stderr.pipe(process.stderr);
                this.process.stdin.pipe(process.stdin);
            }

        }


    })
    ;

module.exports = Command;