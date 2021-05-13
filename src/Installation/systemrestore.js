const { log, execedsync, questions } = require('../Functions');
const { existsSync, writeFileSync } = require('fs');
const { join } = require('path');
const systemRestorefile = `
powershell -ExecutionPolicy Bypass -Command "Checkpoint-Computer -Description \\"Automatic Startup Restore Point\\" -RestorePointType \\"MODIFY_SETTINGS\\""
`;

/**
 * @returns {Promise<Boolean>}
 */
const systemRestore = async () => {
    const windrive = await (await execedsync('echo %WinDir%')).split('\\')[0];
    log('info', 'Enabling System Restore point at every startup. System Protection will only be on for your Windows drive.');
    await execedsync('REG ADD "HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\SystemRestore" /v SystemRestorePointCreationFrequency /d 0x0 /t REG_DWORD /f');
    await execedsync('schtasks /create /sc ONSTART /tn SystemRestorePoint /t "%WinDir%\\System32\\RestorePoint.bat" /f');
    if(!existsSync(join(windrive, '\\Windows\\System32\\RestorePoint.bat'))) writeFileSync(join(windrive, '\\Windows\\System32\\RestorePoint.bat', systemRestorefile));
    return true;
};

/**
 * @returns {Promise<String|Boolean>}
 */
const systemRestoreWithConfig = async () => {
    const config = require('../../config.json');
    if(!config.systemRestore || typeof config.systemRestore != 'boolean') {
        log('info', 'Either `config.systemRestore` doesn\'t exist, or isn\'t of type Boolean. Either way, I\'ll not be doing the system Restore part for you.');
        return 'Not Ok';
    }
    await systemRestore();
    return true;
};

/**
 * @returns {Promise<String|Boolean>}
 */
const systemRestoreWithoutConfig = async () => {
    const systemrestore = await questions('Do you want to create a system restore point at every startup?');
    if(systemrestore.charAt(0) != 'y') {
        log('info', 'Ok, not enabling System Restore at Startup.');
        return 'Not Ok';
    }
    await systemRestore();
    return true;
};

module.exports = {
    systemRestoreWithConfig,
    systemRestoreWithoutConfig,
};
