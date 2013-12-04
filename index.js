var Vitality = require('./src/vitality');
var vitality = new Vitality();

var program = require('commander');

program
    .version(require('./package').version)
    .usage('[options] <file ...>')
    .option('-v, --verbose', 'verbose mode');

program
    .command('*')
    .description('handle <file ...>')
    .action(function (env) {
        vitality.handleFile(env);
    });

program.parse(process.argv);

if(!program.args.length)
    program.help();

module.exports = vitality;