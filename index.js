var Vitality = require('./src/Vitality');
var vitality = new Vitality();

var program = require('commander');

program
    .version(require('./package').version)
    .usage('[options] <file ...>');
//    .option('-v, --verbose', 'verbose mode');

program
    .command('*')
    .description('handle <file ...>')
    .action(function (profile) {
        vitality.run(profile, function (err) {

            if (err)
            {
                process.exit(1);
            }

            process.exit(0);
        });
    });

program.parse(process.argv);

if(!program.args.length)
    program.help();