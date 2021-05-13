// Imports
const { existsSync } = require('fs');
const { join } = require('path');

// Functions
const { systemRestore } = require('./Functions/systemrestore');
const { questions, execedsync } = require('./Functions');
const { getEnvironmentVariables } = require('./Functions/env');
const { writeConfig } = require('./Functions/config');

// Installation
const { installAppsWithConfig, installAppsWithoutConfig } = require('./Installation/apps');
const { WSLwithConfig, WSLwithoutConfig } = require('./Installation/wsl');
const { installCmderWithConfig, installCmderWithoutConfig } = require('./Installation/cmder');
const { installFFmpegWithConfig, installFFmpegWithoutConfig } = require('./Installation/ffmpeg');
const { systemRestoreWithConfig, systemRestoreWithoutConfig } = require('./Installation/systemrestore');
const { IntelDSAWithConfig, IntelDSAWithoutConfig } = require('./Installation/intel');

(async () => {
    if(process.platform != 'win32') {
        console.log(`This is meant to run on Windows only and not on ${process.platform}. Exiting...`);
        process.exit();
    }
    await systemRestore();
    const envVars = await getEnvironmentVariables();
    const [ systemVars, userVars ] = envVars;
    if(existsSync(join(process.cwd(), './config.json'))) {
        await installAppsWithConfig();
        await WSLwithConfig();
        await installCmderWithConfig(systemVars, userVars);
        const updatedenv = await getEnvironmentVariables();
        await installFFmpegWithConfig(updatedenv[0], updatedenv[1]);
        await systemRestoreWithConfig();
        await IntelDSAWithConfig();
    } else {
        const apps = await installAppsWithoutConfig();
        const wsl = await WSLwithoutConfig();
        const cmder = await installCmderWithoutConfig(systemVars, userVars);
        const updatedenv = await getEnvironmentVariables();
        const ffmpeg = await installFFmpegWithoutConfig(updatedenv[0], updatedenv[1]);
        const systemrestore = await systemRestoreWithoutConfig();
        const intelDSA = await IntelDSAWithoutConfig();
        await writeConfig(apps, wsl, cmder, ffmpeg, systemrestore, intelDSA);
    }
    let reboot = await questions('Do you want to reboot to finish the installation? (Reboot is strongly recommended)');
    reboot = reboot.charAt(0) === 'y' ? true : false;
    if(reboot) await execedsync('shutdown.exe /s /t 60 /c "Reboot after apps installation."');
    else process.exit();
})();