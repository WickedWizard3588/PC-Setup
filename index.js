// Do not touch
// This is guarenteed to work on Windows 10, unless the Registry has been modified explicitly.
// This file, gets the ENV Variables and sets them to a Batch Constant

const commands = ['"HKLM\\System\\CurrentControlSet\\Control\\Session Manager\\Environment" /v Path', 'HKCU\\Environment /v Path'];
// Locations where the Environment variables are stored in the registry.
let url = 'https://www.gyan.dev/ffmpeg/builds/packages/ffmpeg-4.4-full_build.7z';
// URL from where we perform a GET request and install FFmpeg
const { exec, execSync } = require('child_process');
const { get } = require('https');
const { appendFileSync } = require('fs');

get('https://www.gyan.dev/ffmpeg/builds/release-version', (response) => {
    response
        .on('data', (found) => {
            found = found.toString();
            url = `https://www.gyan.dev/ffmpeg/builds/packages/ffmpeg-${found}-full_build.7z`;
            console.log('Updated FFmpeg URL');
        });
});

const execedsync = async (command) => { // A constant to make my job easier
    const data = await execSync(command).toString();
    return data;
};

const execed = (command) => { // Same
    const test = exec(command, (err) => {
        if(err) return console.error('ERROR:', err);
    });
    return test.stdout;
};

const installFFmpeg = (rl) => {
    rl.close();
    get(url, (response) => {
        console.log('Installing FFmpeg');
        response
            .on('data', (data) => appendFileSync('ffmpeg.7z', data))
            .on('end', async () => {
                console.log('Finished Installing. \nOpening the ZIP File');
                execed(`7z x "${process.cwd()}\\ffmpeg.7z" *.* "${process.cwd()}"`)
                    .on('data', (data) => console.log('Result:', data))
                    .on('error', (err) => console.log('Error:', err));
                console.log('Changing FFmpegDirectory to current directory.');
                let filename = url.split('/').pop().split('7')[0].split('.');
                filename = `${url[0]}.${url[1]}`;
                await execedsync(`set FFmpegDirectory="${__dirname}\\${filename}"`);
            })
            .on('error', (err) => {
                console.log('ERROR:', err);
            });
    })
};

const questions = (rl, what) => {
    rl.question(`${what}\n`, (answer) => {
        answer = answer.toLowerCase();
        if(answer == 'n') installFFmpeg(rl);
        else if(answer == 'y') rl.close();
        else questions(rl, 'Please enter a valid answer.');
    });
};

const myCustomSetup = async (userVars) => {
    const tasksdirectory = await (await execedsync('set TasksDirectory')).split('=')[1];
    const nirsoftDirectory = await (await execedsync('set NirsoftDirectory')).split('=')[1];
    const sixtyfourbit = await (await execedsync('set sixtyfourbit')).split('=')[1];
    const debugging = await (await execedsync('set Debugging')).split('=')[1];
    const primeninetyfive = await (await execedsync('set PrimeNinetyFive')).split('=')[1];
    const memtest = await (await execedsync('set MemoryTest')).split('=')[1];
    const defaultgiteditor = await (await execedsync('set GitDefaultEditor')).split('=')[1];
    const installation = await (await execedsync('set Installation')).split('=')[1];
    const kms = await (await execedsync('set KMSDirectory')).split('=')[1];

    execed(`setx PATH "${userVars}${tasksdirectory.trim()};${nirsoftDirectory.trim()};${sixtyfourbit.trim()};${debugging.trim()};${primeninetyfive.trim()};${memtest.trim()};${kms.trim()};${installation.trim()}"`) // Trim and set the variables, so that there are no whitespaces.
        .on('data', console.log) // Just a few Events.
        .on('error', console.log);

    await execedsync(`git config --global core.editor "${defaultgiteditor}"`);
    console.log(`Set the default Git editor to ${defaultgiteditor}`);
}

let data = []; // Define data, ofc
const over = new Promise((resolve) => { // Creates a new promise.
    commands.forEach((command) => {
        execedsync(`REG QUERY ${command}`).then((datas) => { // We make use of the `datas` returned to us.
            datas = datas.split('REG_EXPAND_SZ    ')[1] || datas.split('REG_SZ    ')[1]; // Split the result to just get the variables.
            if(!datas) { // Prevent fault ENV Vars
                console.log('Datas error:', data);
                process.exit(); // Exits the process
            }
            data = [...data, datas.trim().endsWith(';') ? datas.trim() : `${datas.trim()};`]; // Sets the data array.
            return resolve(datas); // Resolves the data.
        });
    });
});

over.then(async () => {
    const [ systemVars, userVars ] = data; // Array Destructuring, ES6
    const ffmpeg = await (await execedsync('set FFmpegInstallDirectory')).split('=')[1]; // Get the value of FFmpegInstallDirectory
    const cmder = await (await execedsync('set CmderInstallDirectory')).split('=')[1];
    const programFiles = await (await execedsync('set ProgramFiles')).split('=')[1].replace('ProgramFiles(x86)', '');
    let mongodb = await (await execedsync('choco search mongodb -e')).split('mongodb ')[1].split(' ')[0].split('.');
    mongodb = `${mongodb[0]}.${mongodb[1]}`;
    execed(`setx PATH "${systemVars}${ffmpeg.trim()};${cmder.trim()};${`${programFiles.trim()}\\MongoDB\\Server\\${mongodb.trim()}\\bin`}" /m`) // Trim and set the variables, so that there are no whitespaces.
        .on('data', console.log) // Just a few Events.
        .on('error', console.log);
    execed(`setx %ConEmuDir% "${cmder.trim()}\\vendor\\conemu-maximus5" /m`) // Sets Cmder ENV Vars `%ConEmuDir%
    // We are setting %ConEmuDir% Variable here, instead of the Batch File, because `%` percentage in Batch File refers to a variable, but here, we need it as an Environment Variable name.
        .on('data', console.log) // Few Events
        .on('error', console.log);
    questions(
        require('readline').createInterface({
            input: process.stdin,
            output: process.stdout,
        }), 
        'Did you install FFmpeg? Type "Y" for Yes and "N" for No. \nIf you haven\'t installed, this will install it.'
    );

    // You can comment out the below line, as it is meant for my purpose, i.e. my custom ENV Vars
    myCustomSetup(userVars);
});