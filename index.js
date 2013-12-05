var Vitality = require('./src/Vitality');
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
        vitality.run(env);
    });

program.parse(process.argv);

if(!program.args.length)
    program.help();


module.exports = vitality;