// Do not touch
// This is guarenteed to work on Windows 10, unless the Registry has been modified explicitly.
// This file, gets the ENV Variables and sets them to a Batch Constant

const commands = ['"HKLM\\System\\CurrentControlSet\\Control\\Session Manager\\Environment" /v Path', 'HKCU\\Environment /v Path'];
// Path in the Registry, from where we get the PATH Variables
let ffmpegurl, cmderurl, data = [];
// Define ffmpegurl, cmderurl and data

// Imports
const { exec, execSync } = require('child_process');
const { get } = require('https');
const { appendFileSync, writeFileSync } = require('fs');
const readline = require('readline');
const { join } = require('path');

// Short form
const input = process.stdin;
const output = process.stdout;

// Instructions for installing Cmder
const instructions = `
Hello,
To install Cmder, we need to follow a few steps.

I will start an Install Prompt in your Default Browser.
Please save it to the current directory, i.e. ${process.cwd()}

NOTE:- The filename should be "cmder.zip" (Case Sensitive)

After the download is complete, press enter.
You DO NOT need to unzip it :)

**IMPORTANT:- Some browsers like Microsoft Edge, just directly save it to the Downloads Folder ("%USERPROFILE%\\Downloads").
You can copy paste it from there.

PS:- %USERPROFILE%\\Downloads === C:\\Users\\<Username>\\Downloads**
`;

const cmder_shell = `
@if "%cmder_init%" == "1" (goto :eof) else (set cmder_init=1)
@pushd %CMDER_ROOT%
@call "%CMDER_ROOT%\vendor\init.bat" /f
@popd
`;

// A constant that executes the String Command given and returns the output
const execedsync = async (command) => {
    const data = await execSync(command).toString();
    return data;
};

// A constant that executes the String Command given and return the Stdout to us, allowing better flexibility
const execed = (command) => {
    const data = exec(command, (err) => {
        if(err) return console.error('ERROR:', err);
    });
    return data.stdout;
};

// Returns a Promise, and sets the FFmpeg URL
const ffmpegversion = new Promise((resolve) => {
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

// Returns a Promise and gets the Latest Cmder Release
const cmderversion = new Promise((resolve) => {
    exec('curl -s https://api.github.com/repos/cmderdev/cmder/releases/latest', (err, results) => {
        results = JSON.parse(results);
        results.assets.forEach((result) => {
            if(result.name != 'cmder_mini.zip') return;
            cmderurl = result.browser_download_url;
            resolve(cmderurl);
        });
    })
});

// Returns a promise and sets the Environment Variables
const dataed = new Promise((resolve) => {
    commands.forEach((command) => {
        execedsync(`REG QUERY ${command}`).then((datas) => {
            datas = datas.split('REG_EXPAND_SZ    ')[1] || datas.split('REG_SZ    ')[1];
            if(!datas) {
                console.log('Datas error:', data);
                process.exit();
            }
            data = [...data, datas.trim().endsWith(';') ? datas.trim() : `${datas.trim()};`];
            return resolve(data);
        });
    });
});

// Installs Cmder from the CmderURL
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
                await execed(`${path} x "${process.cwd()}\\cmder.zip" *.* "${process.cwd()}\\Cmder"`)
                    .on('data', (data) => console.log('Result:', data))
                    .on('error', (err) => console.log('Error:', err));
                await execedsync(`set CmderDirectory="${process.cwd()}\\Cmder`);
                return resolve(true);
            });
        }, 10 * 1000);
    });
};

// Installs FFmpeg from the FFmpegURL
const installFFmpeg = (path) => {
    return new Promise((resolve, reject) => {
        get(ffmpegurl, (response) => {
            console.log('Installing FFmpeg');
            response
                .on('data', (data) => appendFileSync('ffmpeg.7z', data))
                .on('end', async () => {
                    console.log('Finished Installing. \nOpening the ZIP File');
                    await execed(`${path} x "${process.cwd()}\\ffmpeg.7z" *.* "${process.cwd()}"`)
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

// Questions to be asked in the console
const questions = (what, type = true, path) => {
    const rl = readline.createInterface({
        input,
        output,
    });
    return new Promise((resolve) => {
        rl.question(`${what}\n`, async (answer) => {
            rl.close()
            answer = answer.toLowerCase();
            if(answer == 'n') await type ? installFFmpeg(path) : installCmder(path);
            else if(answer == 'y') console.log('Ok, moving ahead :)');
            else return questions('Please enter a valid answer.', type, path);
            return resolve(true);
        });
    });
};

const myCustomSetup = async (userVars) => {
    let allvars = [];
    const envvars = ['Debugging', 'Linpack', 'NirLauncher', 'PrimeNinetyFive', 'Tasks', 'Installation', 'KMS'];
    const pathVars = new Promise((resolve) => {
        envvars.forEach(async (envVar) => {
            const eachvar = await (await execedsync(`set ${envVar}`)).split('=')[1]
            allvars = [...allvars, eachvar.trim().endsWith(';') ? eachvar.trim() : `${eachvar.trim()};`];
            resolve(allvars);
        });
    });

    pathVars.then(() => {
        execed(`setx PATH "${userVars}${allvars}"`)
            .on('data', console.log)
            .on('error', console.log);
    });

    const defaultgiteditor = await (await execedsync('set GitDefaultEditor')).split('=')[1];
    const email = await (await execedsync('set GitEmail')).split('=')[1];
    const name = await (await execedsync('set GitName')).split('=')[1];

    await execedsync(`git config --global core.editor "${defaultgiteditor}"`);
    console.log(`Set the default Git editor to ${defaultgiteditor}`);
    
    await execedsync(`git config --global user.name "${name}" && git config --global user.email "${email}"`);
    console.log('Set the default Git Email...')
};

ffmpegversion.then(() => {
    cmderversion.then(() => {
        dataed.then(async () => {
            const [ systemVars, userVars ] = data;
            const ffmpeg = await (await execedsync('set FFmpegInstallDirectory')).split('=')[1];
            const cmder = await (await execedsync('set CmderInstallDirectory')).split('=')[1];
            const programFiles = await (await execedsync('set ProgramFiles')).split('=')[1].replace('ProgramFiles(x86)', '');
            execed(`setx PATH "${systemVars}${ffmpeg.trim()};${cmder.trim()};${`${programFiles.trim()}\\MongoDB\\Server\\${mongodb.trim()}\\bin`}" /m`) // Trim and set the variables, so that there are no whitespaces.
                .on('data', console.log)
                .on('error', console.log);
            execed(`setx %ConEmuDir% "${cmder.trim()}\\vendor\\conemu-maximus5" /m`)
                .on('data', console.log)
                .on('error', console.log);
            await questions('Did you install FFmpeg? Type "Y" for Yes and "N" for No. \nIf you haven\'t installed, this will install it.', true, `${programFiles.trim()}\\7-Zip\\7z.exe`);
            await questions('Did you install Cmder? Type "Y" for Yes and "N" for No. \nIf you haven\'t installed, this will install it', false, `${programFiles.trim()}\\7-Zip\\7z.exe`);

            // You can comment out the below line, as it is meant for my purpose, i.e. my custom ENV Vars
            myCustomSetup(userVars);
        });
    })
});
