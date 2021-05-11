const { execedsync } = require('.');

const registry = ['"HKLM\\System\\CurrentControlSet\\Control\\Session Manager\\Environment" /v Path', 'HKCU\\Environment /v Path'];
let envVars = [];

/**
 * @returns {Promise<Array<String>>}
 */
const getEnvironmentVariables = async () => {
    await execedsync('call refreshenv.cmd');
    for(const reg of registry) {
        let envVar = await execedsync(`REG QUERY ${reg}`);
        envVar = envVar.split('REG_EXPAND_SZ    ')[1] || envVar.split('REG_SZ    ')[1];
        if(!envVar) {
            console.log('There\'s a mistake with Environment Variables', envVar);
            process.exit();
        }
        envVars = [...envVars, envVar.trim().endsWith(';') ? envVar.trim() : `${envVar.trim()};`];
    }
    return envVars;
};

module.exports = {
    getEnvironmentVariables,
};
