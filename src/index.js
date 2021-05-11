// Imports
const { existsSync } = require('fs');
const { join } = require('path');

// Functions
const { getEnvironmentVariables } = require('./Functions/env');
const { writeConfig } = require('./Functions/config');

// Methods
const { installAppsWithConfig, installAppsWithoutConfig } = require('./Installation/apps');
const { WSLwithConfig, WSLwithoutConfig } = require('./Installation/wsl');
const { installCmderWithConfig, installCmderWithoutConfig } = require('./Installation/cmder');
const { installFFmpegWithConfig, installFFmpegWithoutConfig } = require('./Installation/ffmpeg');

(async () => {
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
})();