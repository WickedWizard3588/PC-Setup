// Imports
const { existsSync } = require('fs');
const { join } = require('path');

// Functions
const { questions, execedsync } = require('./Functions');
const { getEnvironmentVariables } = require('./Functions/env');
const { writeConfig } = require('./Functions/config');

// Methods
const { installAppsWithConfig, installAppsWithoutConfig } = require('./Installation/apps');
const { WSLwithConfig, WSLwithoutConfig } = require('./Installation/wsl');
const { installCmderWithConfig, installCmderWithoutConfig } = require('./Installation/cmder');
const { installFFmpegWithConfig, installFFmpegWithoutConfig } = require('./Installation/ffmpeg');

(async () => {
    if(process.platform != 'win32') {
        console.log(`This is meant to run on Windows only and not on ${process.platform}. Exiting...`);
        process.exit();
    }
    const envVars = await getEnvironmentVariables();
    const [ systemVars, userVars ] = envVars;
    if(existsSync(join(process.cwd(), './config.json'))) {
        await installAppsWithConfig();
        await WSLwithConfig();
        await installCmderWithConfig(systemVars, userVars);
        const updatedenv = await getEnvironmentVariables();
        await installFFmpegWithConfig(updatedenv[0], updatedenv[1]);
    } else {
        const apps = await installAppsWithoutConfig();
        const wsl = await WSLwithoutConfig();
        const cmder = await installCmderWithoutConfig(systemVars, userVars);
        const updatedenv = await getEnvironmentVariables();
        const ffmpeg = await installFFmpegWithoutConfig(updatedenv[0], updatedenv[1]);
        await writeConfig(apps, wsl, cmder, ffmpeg);
    }
    let reboot = await questions('Do you want to reboot to finish the installation?');
    reboot = reboot.charAt(0) === 'y' ? true : false;
    if(reboot) await execedsync('shutdown.exe /s /t 60 /c "Reboot after apps installation."');
    else process.exit();
})();