// Do not touch
// This is guarenteed to work on Windows 10, unless the Registry has been modified explicitly.
// This file, gets the ENV Variables and sets them to the Environment Variables

const commands = ['"HKLM\\System\\CurrentControlSet\\Control\\Session Manager\\Environment" /v Path', 'HKCU\\Environment /v Path'];
// Path in the Registry, from where we get the PATH Variables
const envvars = ['Debugging', 'Linpack', 'NirLauncher', 'PrimeNinetyFive', 'Tasks', 'Installation', 'KMS', 'SysInternals', 'WinPE'];
const globalinstalls = ['node-gyp', 'electron-fix'];
// Part of myCustomSetup
let ffmpegurl, cmderurl;
// Define ffmpegurl, cmderurl

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
// My Custom File Scripts
// Powershell script that checks if the given filehashes match
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
// Cmder_shell.bat, mentioned here https://github.com/cmderdev/cmder/wiki/Cmder's-shell-in-other-terminals
const cmder_shell = `
@if "%cmder_init%" == "1" (goto :eof) else (set cmder_init=1)
@pushd %CMDER_ROOT%
@call "%CMDER_ROOT%\\vendor\\init.bat" /f
@popd
`;
// MessageBox Script
const MessageBox = `
$title=$args[0]
$message=$args[1]
$button='OK'

if($title -eq $null -or $message -eq $null) {
    Write "Either Title or Message have not been provided. Please check"
    exit 404
}

Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show($message, $title, $button, [System.Windows.Forms.MessageBoxIcon]::Information);
`;

// A constant that executes the String Command given and returns the output
const execedsync = async (command) => {
    const data = await execSync(command).toString();
    return data;
};

// Returns a Promise, and sets the FFmpeg URL
const ffmpegversion = () => {
    return new Promise((resolve) => {
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
};

// Returns a Promise and gets the Latest Cmder Release
const cmderversion = () => {
    return new Promise((resolve) => {
        exec('curl -s https://api.github.com/repos/cmderdev/cmder/releases/latest', (err, results) => {
            results = JSON.parse(results);
            results.assets.forEach((result) => {
                if(result.name != 'cmder_mini.zip') return;
                cmderurl = result.browser_download_url;
                resolve(cmderurl);
            });
        });
    });
};

let data = [];
// Returns a promise and sets the Environment Variables
const dataed = () => {
    return new Promise((resolve) => {
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
};

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
                console.log(await execedsync(`${path} x "${__dirname}\\cmder.zip" *.* "${__dirname}\\Cmder"`));
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
                    console.log(await execedsync(`${path} x "${__dirname}\\ffmpeg.7z" *.* "${__dirname}"`));
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
    }).then(async (allvars) => console.log(await execedsync(`setx PATH "${userVars}${allvars}"`)));

    const defaultgiteditor = await execedsync('echo %GitDefaultEditor%');
    const email = await execedsync('echo %GitEmail%');
    const name = await execedsync('echo %GitName%');
    const systemroot = await execedsync('echo %SystemRoot%');
    const tasks = await execedsync('echo %Tasks%');
    const cmdnames = [
        // Git
        `git config --global core.editor "${defaultgiteditor}"`,
        `git config --global user.name "${name}"`,
        `git config --global user.email "${email}"`,
        // Registry Modifications
        'echo Yes | REG DELETE HKCR\\Directory\\Background\\shell\\cmd /v Extended',
        'echo Yes | REG DELETE HKCR\\Directory\\Background\\shell\\cmd /v HideBasedOnVelocityId',
        `SCHTASKS /Create /SC Onstart /TN "System Restore Point" /TR "${tasks}\\SystemRestore.bat"`,
        'REG ADD "HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\SystemRestore" /v SystemRestorePointCreationFrequency /d 0x0 /t REG_DWORD',
        // WSL (Windows SubSystem for Linux)
        'DISM /Online /Enable-Feature /Featurename:Microsoft-Windows-Subsystem-Linux /all /norestart',
        'DISM /Online /Enable-Feature /Featurename:VirtualMachinePlatform /all /norestart',
        'curl -o wsl.msi https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi',
        'msiexec /i wsl.msi',
        'wsl --set-default-version 2',
        'curl.exe -L -o ubuntu.appx https://aka.ms/wslubuntu2004',
        'powershell -Command "Add-AppxPackage .\\ubuntu.appx"',
    ];
    const filenames = [
        `${systemroot}\\System32\\FileHash.ps1`,
        join(__dirname, './Cmder', '/cmder_shell.bat'),
        `${systemroot}\\System32\\MessageBox.ps1`
    ];
    const filevalues = [
        FileHash,
        cmder_shell,
        MessageBox,
    ];

    filenames.forEach((filename, i) => {
        if(!existsSync(filename)) writeFileSync(filename, filevalues[i]);
    });

    for(const globalinstall of globalinstalls) await execedsync(`npm i -g ${globalinstall}`);
    for(const cmdname of cmdnames) await execedsync(cmdname);

    const autorun_exists = await execedsync('REG QUERY "HKEY_CURRENT_USER\\Software\\Microsoft\\Command Processor" /v AutoRun');
    if(autorun_exists.includes('ERROR:')) await execedsync('REG ADD "HKEY_CURRENT_USER\\Software\\Microsoft\\Command Processor" /v AutoRun /d cmder_shell.bat');
};

// Callback Hell :joy:
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
            console.log(await execedsync(`setx PATH "${systemVars}${ffmpeg.trim()};${cmder.trim()};${exists ? `${programFiles.trim()}\\MongoDB\\Server\\${mongodb.trim()}\\bin` : ''} /m`)); // Trim and set the variables, so that there are no whitespaces.
            console.log(await execedsync(`setx %ConEmuDir% "${cmder.trim()}\\vendor\\conemu-maximus5" /m`));
            await questions('Did you install FFmpeg? Type "Y" for Yes and "N" for No. \nIf you haven\'t installed, this will install it.', true, `"${programFiles.trim()}\\7-Zip\\7z.exe"`);
            await questions('Did you install Cmder? Type "Y" for Yes and "N" for No. \nIf you haven\'t installed, this will install it', false, `"${programFiles.trim()}\\7-Zip\\7z.exe"`);

            // You can comment out the below line, as it is meant for my purpose, i.e. my custom ENV Vars
            myCustomSetup(userVars);
        });
    });
});
