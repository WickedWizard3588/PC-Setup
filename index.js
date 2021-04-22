// Do not touch
// This is guarenteed to work on Windows 10, unless the Registry has been modified explicitly.
// This file, gets the ENV Variables and sets them to a Batch Constant

const commands = ['"HKLM\\System\\CurrentControlSet\\Control\\Session Manager\\Environment" /v Path', 'HKCU\\Environment /v Path'];
// Locations where the Environment variables are stored in the registry.
let ffmpegurl = 'https://www.gyan.dev/ffmpeg/builds/packages/ffmpeg-4.4-full_build.7z';
let cmderurl;
// URL from where we perform a GET request and install FFmpeg
const { exec, execSync } = require('child_process');
const { get } = require('https');
const { appendFileSync } = require('fs');
const readline = require('readline');
const input = process.stdin;
const output = process.stdout;
const instructions = `
Hello,
To install Cmder, we need to follow a few steps.

I will start an Install Prompt in your Default Browser.
Please save it to the current directory, i.e. ${process.cwd()}

NOTE:- The filename should be "cmder.zip" (Case Sensitive)

After the download is complete, press enter.
You DO NOT need to unzip it :)
`;

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

const ffmpegversion = new Promise ((resolve) => {
    get('https://www.gyan.dev/ffmpeg/builds/release-version', (response) => {
        response
            .on('data', (data) => {
                data = data.toString();
                ffmpegurl = `https://www.gyan.dev/ffmpeg/builds/packages/ffmpeg-${data}-full_build.7z`;
                console.log('Updated FFmpeg URL');
                resolve(ffmpegurl);
            });
    });
});

const cmderversion = new Promise ((resolve) => {
    exec('curl -s https://api.github.com/repos/cmderdev/cmder/releases/latest', (err, results) => {
        results = JSON.parse(results);
        results.assets.forEach(result => {
            if(result.name != 'cmder_mini.zip') return;
            cmderurl = result.browser_download_url;
            resolve(cmderurl);
        });
    })
});


const installCmder = (path) => {
    return new Promise(async (resolve) => {
        const rl = readline.createInterface({
            input,
            output,
        });
        console.log(instructions);
        setTimeout(async () => {
            await execedsync(`start "" "${cmderurl}"`);
            rl.question('Done? \n', async () => {
                rl.close();
                execed(`${path} x "${process.cwd()}\\cmder.zip" *.* "${process.cwd()}\\Cmder"`)
                    .on('data', (data) => console.log('Result:', data))
                    .on('error', (err) => console.log('Error:', err));
                await execedsync(`set CmderDirectory="${process.cwd()}\\Cmder`);
                return resolve(true);
            });
        }, 10 * 1000);
    });
};

const installFFmpeg = (path) => {
    return new Promise ((resolve, reject) => {
        get(ffmpegurl, (response) => {
            console.log('Installing FFmpeg');
            response
                .on('data', (data) => appendFileSync('ffmpeg.7z', data))
                .on('end', async () => {
                    console.log('Finished Installing. \nOpening the ZIP File');
                    execed(`${path} x "${process.cwd()}\\ffmpeg.7z" *.* "${process.cwd()}"`)
                        .on('data', (data) => console.log('Result:', data))
                        .on('error', (err) => console.log('Error:', err));
                    console.log('Changing FFmpegDirectory to current directory.');
                    let filename = url.split('/').pop().split('7')[0].split('.');
                    filename = `${url[0]}.${url[1]}`;
                    await execedsync(`set FFmpegDirectory="${process.cwd()}\\${filename}"`);
                    return resolve(true);
                })
                .on('error', (err) => {
                    console.log('ERROR:', err);
                    reject(err);
                });
        })
    });
};

const questions = (what, type = true, path) => {
    const rl = readline.createInterface({
        input,
        output,
    });
    return new Promise ((resolve) => {
        rl.question(`${what}\n`, async (answer) => {
            rl.close()
            answer = answer.toLowerCase();
            if(answer == 'n') await type ? installFFmpeg(path) : installCmder(path);
            else if(answer == 'y') console.log('Ok, moving ahead :)');
            else return questions('Please enter a valid answer.');
            return resolve(true);
        });
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
ffmpegversion.then(() => {
    cmderversion.then(() => {
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
                    return resolve(data); // Resolves the data.
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
            await questions('Did you install FFmpeg? Type "Y" for Yes and "N" for No. \nIf you haven\'t installed, this will install it.', true, `${programFiles}\\7-Zip\\7z.exe`);
            await questions('Did you install Cmder? Type "Y" for Yes and "N" for No. \nIf you haven\'t installed, this will install it', false, `${programFiles}\\7-Zip\\7z.exe`);

            // You can comment out the below line, as it is meant for my purpose, i.e. my custom ENV Vars
            myCustomSetup(userVars);
        });
    })
});
