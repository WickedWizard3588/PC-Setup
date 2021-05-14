const { execedsync, log, questions } = require('../Functions');

/**
 * @returns {Promise<Boolean|String>}
 */
const IntelDSAWithConfig = async () => {
    const config = require('../../config.json');
    const processor = await execedsync('echo %PROCESSOR_IDENTIFIER%');
    if(!config.IntelDSA || typeof config.IntelDSA != 'boolean' || !processor.includes('Intel')) {
        log('info', 'I see that you haven\'t set `intelDriverandSupportAssistant` in your config.json, or it isn\'t of type Boolean, or your processor isn\'t Intel. Either way, I won\'t install Intel Driver and Support Assistant');
        return 'Not Ok';
    }
    log('info', 'Installing Intel Driver and Support Assistant');
    await execedsync('choco install intel-dsa');
    return true;
};

/**
 * @returns {Promise<Boolean|String>}
 */
const IntelDSAWithoutConfig = async () => {
    const processor = await execedsync('echo %PROCESSOR_IDENTIFIER%');
    if(!processor.includes('Intel')) {
        log('info', 'I see that you lack an Intel Processor. So, I will not be installing Intel Driver and Support Assistant.');
        return 'Not Ok';
    }
    const install = await questions('Do you want to install Intel Driver and Support?');
    if(!install.charAt(0) == 'y') {
        log('Ok, I will not install Intel DSA.');
        return 'Not Ok';
    }
    log('info', 'Installing Intel DSA.');
    await execedsync('choco install intel-dsa');
    log('info', 'Successfully installed Intel DSA. Now you can have your new Intel Drivers Installed');
    return true;
};

module.exports = {
    IntelDSAWithConfig,
    IntelDSAWithoutConfig,
};
