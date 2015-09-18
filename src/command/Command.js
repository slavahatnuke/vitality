var Class = require('define-class');
var exec = require('child_process').exec

var Command = Class({

    command: false,
    stdio: false,

    process: false,

    error: false,
    stdout: false,
    stderr: false,

    output: '',
    code: 0,

    init: function (command, stdio) {
        this.command = command;
        this.stdio = stdio;
        this.error = null;
    },


    run: function (next) {
        var self = this;

        this.process = exec(this.command, {maxBuffer: 2*1024*1024*1024},
            function (error, stdout, stderr) {

                self.error = error;

                self.stdout = stdout;
                self.stderr = stderr;

                self.output = '' + stdout + stderr;

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


});

module.exports = Command;