const config = require('../../config.json');
const { log, execedsync, questions } = require('../Functions');
/* eslint-disable no-empty-function */
/**
 * @param {String} finaldirectory
 * @param {Boolean} environmentVariables
 * @param {String} envType
 * @param {String} systemVars
 * @param {String} userVars
 * @param {Boolean} contextmenu
 * @returns {Promise<String>}
 */
const getCmder = (finaldirectory, environmentVariables, envType, systemVars, userVars, contextmenu) => {
    envType = envType.toLowerCase();
    return new Promise((resolve) => {
        execedsync('curl -s https://api.github.com/repos/cmderdev/cmder/releases/latest').then(async (results) => {
            results = JSON.parse(results);
            results.assets.forEach(async (result) => {
                if(result.name != 'cmder_mini.zip') return;
                const commands = [
                    `curl -L -o Cmder.zip ${result.browser_download_url}`,
                    `powershell -Command "Expand-Archive \\"${__dirname}\\cmder.zip\\" \\"${__dirname}\\Cmder\\"`,
                    `robocopy "${__dirname}\\Cmder\\" "${finaldirectory}" /E /V /MOVE`,
                    'echo Y | del Cmder.zip',
                ];
                for(const command of commands) await execedsync(command);

                if(environmentVariables) {
                    const variables = [
                        `setx PATH "${envType === 'system' ? systemVars : userVars}${finaldirectory}"`,
                        `setx %ConEmuDir% "${finaldirectory}\\vendor\\conemu-maximus5"`,
                        `setx CMDER_ROOT ${finaldirectory}`,
                        'call refreshenv.cmd',
                    ];
                    for(const variable of variables) await execedsync(`${variable} ${envType == 'system' ? '/m' : ''}`);
                }
                if(contextmenu) await execedsync(`${finaldirectory}Cmder.exe /REGISTER ${envType == 'system' ? 'ALL' : 'USER'}`);
                resolve(result.browser_download_url);
            });
        });
    });
};

/**
 * @param {String} systemVars
 * @param {String} userVars
 * @returns {Promise<Boolean>}
 */
const installCmderWithConfig = (systemVars, userVars) => {
    return new Promise((resolve) => {
        if(!config.cmder || Object.keys(config.cmder).length === 0 || typeof config.cmder != 'object' || !config.cmder.finalDirectory) {
            log('Error', 'config.cmder either doesn\'t exist, or it isn\'t of type Object or is an empty Object, or the final directory doesn\'t exist');
            resolve(true);
        } else {
            log('Info', 'Installing Cmder');
            getCmder(
                config.cmder.finalDirectory.endsWith('\\') ? config.cmder.finalDirectory : `${config.cmder.finalDirectory}\\`,
                config.cmder.environmentVariables,
                config.cmder.global,
                systemVars,
                userVars,
                config.cmder['context-menu'],
            ).then(() => resolve(true));
        }
    });
};

/**
 * @param {String} systemVars
 * @param {String} userVars
 * @returns {Promise<Array<String|Boolean>>}
 */
const installCmderWithoutConfig = (systemVars, userVars) => {
    return new Promise((resolve) => {
        questions('Do you want me to install Cmder for you?').then(async (answer) => {
            if(answer.charAt(0) === 'y') {
                log('Info', 'Installing Cmder');
                questions('Where do you want to place Cmder after installing?').then(async (finaldir) => {
                    const environmentVariables = await questions('Do you want to set the Environment Variables for Cmder?');
                    const globalenv = await questions('Should Cmder be set at a Global Level?');
                    const contextmenu = await questions('Do you want the Context Menu option for Cmder?');
                    getCmder(
                        finaldir.endsWith('\\') ? finaldir : `${finaldir}\\`,
                        environmentVariables.charAt(0) == 'y' ? true : false,
                        globalenv.charAt(0) == 'y' ? 'system' : 'user',
                        systemVars,
                        userVars,
                        contextmenu.charAt(0) == 'y' ? true : false,
                    ).then(() => {
                        resolve([
                            finaldir,
                            environmentVariables.charAt(0) == 'y' ? true : false,
                            globalenv.charAt(0) == 'y' ? true : false,
                            contextmenu.charAt(0) == 'y' ? true : false,
                        ]);
                    });
                });
            } else {
                log('info', 'Ok, will skip Cmder installation');
                resolve(true);
            }
        });
    });
};

module.exports = {
    installCmderWithConfig,
    installCmderWithoutConfig,
};
