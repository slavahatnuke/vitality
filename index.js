var Vitality = require('./src/Vitality');
var vitality = Vitality.new();

var program = require('commander');

program
    .version(require('./package').version)
    .usage('[options] <file ...>');
//    .option('-v, --verbose', 'verbose mode');

program
    .command('*')
    .description('handle <file ...>')
    .action(function (profile) {
        vitality.run(profile);
    });

program.parse(process.argv);

if(!program.args.length)
    program.help();