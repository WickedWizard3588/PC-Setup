// Do not touch
// This is guarenteed to work on Windows 10, unless the Registry has been modified explicitly.
// This file, gets the ENV Variables and sets them to a Batch Constant

const commands = ['"HKLM\\System\\CurrentControlSet\\Control\\Session Manager\\Environment" /v Path', 'HKCU\\Environment /v Path'];
// Path in the Registry, from where we get the PATH Variables
const envvars = ['Debugging', 'Linpack', 'NirLauncher', 'PrimeNinetyFive', 'Tasks', 'Installation', 'KMS', 'SysInternals', 'WinPE'];
// Part of myCustomSetup
let ffmpegurl, cmderurl;
// Define ffmpegurl, cmderurl and data

// Imports
const { exec, execSync } = require('child_process');
const { get } = require('https');
const { appendFileSync, existsSync, writeFileSync } = require('fs');
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
Please save it to the current directory, i.e. ${__dirname}

NOTE:- The filename should be "cmder.zip" (Case Sensitive)

After the download is complete, press enter.
You DO NOT need to unzip it :)

**IMPORTANT:- Some browsers like Microsoft Edge, just directly save it to the Downloads Folder ("%USERPROFILE%\\Downloads").
You can copy paste it from there.

PS:- %USERPROFILE%\\Downloads === C:\\Users\\<Username>\\Downloads**
`;
const FileHash = `
$File=$args[0]
$Hash=$args[1]
$Algorithm=$args[2]

if($File -eq $null -or $Hash -eq $null) {
    Write "Either FileName or Hash has not been provided, please check"
    exit 404
}

if($Algorithm -eq $null) {
    Write "Algorithm has not been provided, going to default SHA256"
    $Algorithm="SHA256"
} else {
    Write "Algorithm has been provided, going with the provided one $Algorithm"
}

$FileHash=(Get-FileHash $File -Algorithm $Algorithm).Hash

if($FileHash -eq $Hash) { Write "This is the correct File Hash... Congrats" }
else { Write "The File Hashes don't match. Please redownload" }
`;
const cmder_shell = `
@if "%cmder_init%" == "1" (goto :eof) else (set cmder_init=1)
@pushd %CMDER_ROOT%
@call "%CMDER_ROOT%\\vendor\\init.bat" /f
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
    });
});

let data = [];
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
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input,
            output,
        });
        console.log(instructions);
        setTimeout(async () => {
            await execedsync(`start "" "${cmderurl}"`);
            rl.question('Done? \n', async () => {
                rl.close();
                await execed(`${path} x "${__dirname}\\cmder.zip" *.* "${__dirname}\\Cmder"`)
                    .on('data', (got) => console.log('Result:', got))
                    .on('error', (err) => console.log('Error:', err));
                await execedsync(`set CmderDirectory="${__dirname}\\Cmder`);
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
                .on('data', (got) => appendFileSync('ffmpeg.7z', got))
                .on('end', async () => {
                    console.log('Finished Installing. \nOpening the ZIP File');
                    await execed(`${path} x "${__dirname}\\ffmpeg.7z" *.* "${__dirname}"`)
                        .on('data', (got) => console.log('Result:', got))
                        .on('error', (err) => console.log('Error:', err));
                    console.log('Changing FFmpegDirectory to current directory.');
                    const filename = ffmpegurl.replace('.7z', '');
                    await execedsync(`set FFmpegDirectory="${__dirname}\\${filename}"`);
                    return resolve(true);
                })
                .on('error', (err) => {
                    console.log('ERROR:', err);
                    reject(err);
                });
        });
    });
};

// Questions to be asked in the console
const questions = (what, type = true, path) => {
    const rl = readline.createInterface({
        input,
        output,
    });
    return new Promise((resolve) => {
        rl.question(`${what} \nNote that the ENV Vars have already been set. \n`, async (answer) => {
            rl.close();
            answer = answer.toLowerCase().charAt(0);
            if(answer == 'n') await type ? installFFmpeg(path) : installCmder(path);
            else if(answer == 'y') console.log('Ok, moving ahead :)');
            else return questions('Please enter a valid answer.', type, path);
            return resolve(true);
        });
    });
};

const myCustomSetup = async (userVars) => {
    new Promise((resolve) => {
        let allvars = '';
        envvars.forEach(async (envVar) => {
            const eachvar = await execedsync(`echo %${envVar}%`);
            allvars = `${allvars}${eachvar.trim().endsWith(';') ? eachvar.trim() : `${eachvar.trim()};`}`;
            resolve(allvars);
        });
    }).then((allvars) => {
        execed(`setx PATH "${userVars}${allvars}"`)
            .on('data', console.log)
            .on('error', console.log);
    });

    const defaultgiteditor = await execedsync('echo %GitDefaultEditor%');
    const email = await execedsync('echo %GitEmail%');
    const name = await execedsync('echo %GitName%');
    const systemroot = await execedsync('echo %SystemRoot%');
    const cmdnames = [
        `git config --global core.editor "${defaultgiteditor}"`,
        `git config --global user.name "${name}" && git config --global user.email "${email}"`,
        'echo Yes | REG DELETE HKCR\\Directory\\Background\\shell\\cmd /v Extended',
        'echo Yes | REG DELETE HKCR\\Directory\\Background\\shell\\cmd /v HideBasedOnVelocityId',
        'DISM /Online /Enable-Feature /Featurename:Microsoft-Windows-Subsystem-Linux',
    ];

    for(const install of ['node-gyp', 'electron-fix']) await execedsync(`npm i -g ${install}`);
    for(const cmdname of cmdnames) await execedsync(cmdname);

    if(!existsSync(`${systemroot}\\System32\\FileHash.ps1`)) {
        console.log('FileHash.ps1 doesn\'t exist, creating the file');
        writeFileSync(`${systemroot}\\System32\\FileHash.ps1`, FileHash);
    }
    if(!existsSync(join(__dirname, './Cmder', '/cmder_shell.bat'))) {
        console.log('cmder_shell.bat doesn\'t exist, creating it');
        writeFileSync(join(__dirname, './Cmder', '/cmder_shell.bat'), cmder_shell);
    }

    const autorun_exists = await execedsync('REG QUERY "HKEY_CURRENT_USER\\Software\\Microsoft\\Command Processor" /v AutoRun');
    if(autorun_exists.includes('ERROR:')) await execedsync('REG ADD "HKEY_CURRENT_USER\\Software\\Microsoft\\Command Processor" /v AutoRun /d cmder_shell.bat');
};

ffmpegversion.then(() => {
    cmderversion.then(() => {
        dataed.then(async () => {
            const [ systemVars, userVars ] = data;
            const ffmpeg = await execedsync('echo %FFmpegInstallDirectory%');
            const cmder = await execedsync('echo %CmderInstallDirectory%');
            const programFiles = await execedsync('echo %ProgramFiles%');
            let mongodb = '';
            let exists = await execedsync('choco search mongodb -e');
            if(exists.includes('0 packages found.')) {
                exists = false;
            } else {
                exists = true;
                mongodb = await (await execedsync('choco search mongodb -e')).split('mongodb ')[1].split(' ')[0].split('.');
                mongodb = `${mongodb[0]}.${mongodb[1]}`;
            }
            execed(`setx PATH "${systemVars}${ffmpeg.trim()};${cmder.trim()};${exists ? `${programFiles.trim()}\\MongoDB\\Server\\${mongodb.trim()}\\bin` : ''} /m`) // Trim and set the variables, so that there are no whitespaces.
                .on('data', console.log)
                .on('error', console.log);
            execed(`setx %ConEmuDir% "${cmder.trim()}\\vendor\\conemu-maximus5" /m`)
                .on('data', console.log)
                .on('error', console.log);
            await questions('Did you install FFmpeg? Type "Y" for Yes and "N" for No. \nIf you haven\'t installed, this will install it.', true, `"${programFiles.trim()}\\7-Zip\\7z.exe"`);
            await questions('Did you install Cmder? Type "Y" for Yes and "N" for No. \nIf you haven\'t installed, this will install it', false, `"${programFiles.trim()}\\7-Zip\\7z.exe"`);

            // You can comment out the below line, as it is meant for my purpose, i.e. my custom ENV Vars
            myCustomSetup(userVars);
        });
    });
});
