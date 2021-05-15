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

/**
 * @returns {Promise<Array<String>|Array<>>}
 */
const installAppsWithoutConfig = async () => {
    const answer = await questions('Do you want to install any apps?');
    if(answer.charAt(0) != 'y') {
        log('info', 'Ok then, we shall not install any apps then');
        return true;
    }
    let apps = await questions(`
        We need to follow a few steps, since you want to install apps.
        First of all, have a list of apps that you want to install.
        Next, go to this website (https://community.chocolatey.org/packages/), and gather the app-ids of the apps that you want to install.
        Look at this picture on how to get app-id https://i.imgur.com/XU9Fdce.png

        After gathering, type out all your app ids with a space separating them.
        Example
        docker-cli notion discord
    `);

    console.log(await execedsync(`choco install ${apps}`));
    apps = [apps.split(' ').join(', ')];
    return apps;
};

module.exports = {
    installAppsWithConfig,
    installAppsWithoutConfig,
};
