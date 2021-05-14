const { execedsync, log, questions } = require('../Functions');

/**
 * @returns {Promise<Boolean>}
 */
const intelRST = async () => {
    await execedsync('choco install intel-rst-driver');
    return true;
};

/**
 * @returns {Promise<Boolean>}
 */
const intelRSTCheck = async () => {
    const query = await execedsync('driverquery /FO LIST');
    if(query.includes('iaStorAC') && query.includes('Intel(R) Chipset SATA/PCIe RST Premium Controller')) return true;
    return false;
};

/**
 * @returns {Promise<Boolean>}
 */
const intelRSTWithConfig = async () => {
    const config = require('../../config.json');
    const check = await intelRSTCheck();
    if(!config.IntelRST || typeof config.IntelRST != 'boolean' || !check) {
        log('info', 'I have not detected Intel RST on this system, or the config has been set that way. Either way, Intel RST will not be installed.');
        return false;
    }
    await intelRST();
    return true;
};

/**
 * @returns {Promise<Boolean>}
 */
const intelRSTWithoutConfig = async () => {
    if(!intelRST) {
        log('Info', 'I haven\'t detected Intel RST on this system, so I shall not install it');
        return false;
    }
    const answer = await questions('Do you want to install Intel RST?');
    if(answer.charAt(0) != 'y') {
        log('result', 'Ok, I shall not install Intel RST');
        return false;
    }
    await intelRST();
    return true;
};

module.exports = {
    intelRSTWithConfig,
    intelRSTWithoutConfig,
};