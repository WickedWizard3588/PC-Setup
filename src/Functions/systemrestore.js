const { log, execedsync } = require('.');

/**
 * @returns {Promise<Boolean>}
 */
const systemRestore = async () => {
    log('info', 'Creating a System Restore Point before starting installation of apps.');
    const windrive = await (await execedsync('echo %WinDir%')).split('\\')[0];
    log('Info', `Enabling System Protection for ${windrive} only.`);
    await execedsync(`powershell -Command "Enable-ComputerRestore -Drive ${windrive}"`);
    await execedsync('powershell -ExecutionPolicy Bypass -Command "Checkpoint-Computer -Description \\"Before Apps Installation\\" -RestorePointType \\"MODIFY_SETTINGS\\""');
    return true;
};

module.exports = {
    systemRestore,
};
