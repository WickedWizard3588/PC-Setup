const { questions, execedsync, log } = require('../Functions');

/**
 * @param {Boolean} upgrade
 * @param {Number} defaultversion
 * @param {Boolean} ubuntu
 * @returns {Promise<Number>}
 */
const wsl = (upgrade, defaultversion, ubuntu) => {
    return new Promise((resolve) => {
        execedsync('DISM /Online /Enable-Feature /Featurename:Microsoft-Windows-Subsystem-Linux /all /norestart').then(async () => {
            if(upgrade) {
                log('Info', 'Upgrading to WSL2');
                const commands = [
                    'DISM /Online /Enable-Feature /Featurename:VirtualMachinePlatform /all /norestart',
                    'curl -o wsl.msi https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi',
                    'msiexec /i wsl.msi',
                ];
                for(const command of commands) log('result', await execedsync(command));
            }
            await execedsync(`wsl --set-default-version ${defaultversion}`);
            if(ubuntu) {
                const commands = [
                    'curl.exe -L -o ubuntu.appx https://aka.ms/wslubuntu2004',
                    'powershell -Command "Add-AppxPackage .\\ubuntu.appx"',
                ];
                for(const command of commands) await execedsync(command);
            }
            resolve(defaultversion);
        });
    });
};

/**
 * @returns {Promise<Boolean>}
 */
const WSLwithConfig = () => {
    return new Promise((resolve) => {
        const config = require('../../config.json');
        if(!config.wsl || Object.keys(config.wsl) === 0 || typeof config.wsl != 'object') {
            log('Error', 'Either config.wsl doesn\'t exist, or it isn\'t of the type Object or is an empty Object');
            resolve(false);
        } else {
            wsl(
                config.wsl.upgrade,
                config.wsl['default-version'] || config.wsl.upgrade ? 2 : 1,
                config.wsl.ubuntu,
            ).then(() => resolve(true));
        }
    });
};

/**
 * @returns {Promise<Number|Boolean>}
 */
const WSLwithoutConfig = () => {
    return new Promise((resolve) => {
        questions('Do you want to install WSL?').then(async (answer) => {
            if(answer.charAt(0) === 'y') {
                let version = await questions('Do you want to upgrade to WSL2?');
                version = version.charAt(0) == 'y' ? true : false;
                let ubuntu = await questions('Do you want to install Ubuntu as your default WSL Distribution?');
                ubuntu = ubuntu.charAt(0) == 'y' ? true : false;
                const dfversion = await wsl(
                    version,
                    version ? await questions('Which version of WSL do you want to set as default. Reply with either 1 or 2') : 1,
                    ubuntu,
                );
                resolve(dfversion);
            } else {
                log('info', 'Ok, WSL will not be installed');
                resolve(true);
            }
        });
    });
};

module.exports = {
    WSLwithConfig,
    WSLwithoutConfig,
};