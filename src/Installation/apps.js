const { execedsync, log, questions } = require('../Functions');

/**
 * @returns {Promise<Boolean>}
 */
const installAppsWithConfig = async () => {
    const config = require('../../config.json');
    if(!config.apps || !Array.isArray(config.apps) || config.apps.length === 0) {
        log('Error', 'Either config.apps doesn\'t exist, or it isn\'t of the type Array or is an empty Array. Skipping apps installation');
        return true;
    }
    for(const app of config.apps) log('result', await execedsync(`choco install ${config.apps[app]}`));
    return true;
};

let apps = [];

/**
 * @returns {Promise<Array<String>|Array<>>}
 */
const installAppsWithoutConfig = async () => {
    const answer = await questions('Do you want to install any app? (Y/N)');
    if(answer.charAt(0) === 'y') {
        const appname = await questions('Which app do you want to install?');
        log('Info', `Searching for ${appname}`);
        log('Result', await execedsync(`choco search ${appname}`));
        const app = await questions('Which app do you want to install?');
        log('Info', await execedsync(`choco install ${app}`));
        apps = [...apps, app];
        installAppsWithoutConfig();
    } else {
        log('Info', 'Ok, proceeding.');
        return apps;
    }
};

module.exports = {
    installAppsWithConfig,
    installAppsWithoutConfig,
};
