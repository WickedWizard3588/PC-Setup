const { execedsync, log, questions } = require('../Functions');

/**
 * @returns {Promise<Boolean>}
 */
const installAppsWithConfig = () => {
    return new Promise((resolve) => {
        const config = require('../../config.json');
        if(!config.apps || !Array.isArray(config.apps) || config.apps.length === 0) {
            log('Error', 'Either config.apps doesn\'t exist, or it isn\'t of the type Array or is an empty Array. Skipping apps installation');
            resolve(true);
        } else {
            for(const app in config.apps) execedsync(`choco install ${config.apps[app]}`).then((result) => log('result', result));
            resolve(true);
        }
    });
};

let apps = [];
/**
 * @returns {Promise<Array<String>|Array<>>}
 */
const installAppsWithoutConfig = () => {
    return new Promise((resolve) => {
        questions('Do you want to install any app? (Y/N)').then(async (answer) => {
            if(answer.charAt(0) === 'y') {
                const appname = await questions('Which app do you want to install?');
                log('Info', `Searching for ${appname}`);
                log('Result', await execedsync(`choco search ${appname}`));
                const app = await questions('Which app do you want to install?');
                log('Info', await execedsync(`choco install ${app}`));
                apps = [...apps, app];
                installAppsWithoutConfig;
            } else {
                log('Info', 'Ok, proceeding.');
                resolve(apps);
            }
        });
    });
};

module.exports = {
    installAppsWithConfig,
    installAppsWithoutConfig,
};