const { execedsync, log, questions } = require('../Functions');
/**
 * @returns {Promise<Boolean>}
 */
const AsusX407UAR = async () => {
    let i = -1;
    const drivers = [
        'https://dlcdnets.asus.com/pub/ASUS/nb/Image/Driver/Networking/22670/WirelessLan_DCH_QualcommAtheros_Z_V12.0.0.1076_22670.exe',
        'https://dlcdnets.asus.com/pub/ASUS/nb/DriversForWin10/WirelessRadioControl/WirelessRadioControl_Win10_64_VER10011.zip',
        'https://dlcdnets.asus.com/pub/ASUS/nb/DriversForWin10/IRST/IRST_DCH_Intel_Win10_64_V17501017.zip',
        'https://dlcdnets.asus.com/pub/ASUS/Desktop/Apps_for_Win10/ICEsound/ICEsound_APO_driver_DCH_ICEPower_Z_V2.9.200504_17957.exe',
        'https://dlcdnets.asus.com/pub/ASUS/nb/DriversForWin10/VGA/VGA_Intel_Win10_64_VER26201007372_DriverOnly.zip',
        'https://dlcdnets.asus.com/pub/ASUS/nb/DriversForWin10/CardReader/CardReader_Alcor_Win10_64_VER2014910100.zip',
        'https://dlcdnets.asus.com/pub/ASUS/nb/DriversForWin10/TouchPad/Touchpad_DCH_ASUS_Win10_64_VER110030.zip',
        'https://dlcdnets.asus.com/pub/ASUS/nb/Apps_for_Win10/ATKPackage/ATK_Package_V100061.zip',
        'https://dlcdnets.asus.com/pub/ASUS/nb/Image/Driver/Bluetooth/22669/Bluetooth_DCH_QualcommAtheros_Z_V10.0.0.1076_22669.exe',
        'https://dlcdnets.asus.com/pub/ASUS/nb/Image/Software/SoftwareandUtility/13083/ASUSSystemControlInterface_ASUS_Z_V1.0.34.0_13083.exe',
        'https://dlcdnets.asus.com/pub/ASUS/nb/Apps_for_Win10/Winflash/Winflash_Win10_64_VER325.zip',
        'https://dlcdnets.asus.com/pub/ASUS/nb/DriversForWin10/Fingerprint/Fingerprint_ELAN_Win10_64_VER45100110601.zip',
    ];
    const filename = [
        'Networking.exe',
        'Wireless.zip',
        'IRST.zip',
        'ICESound.exe',
        'Graphics.zip',
        'Card-Reader.zip',
        'Touchpad.zip',
        'ATK.zip',
        'Bluetooth.exe',
        'SystemControlInterface.exe',
        'WinFlash.zip',
        'Biometric.zip',
    ];
    for(const driver of drivers) {
        i++;
        await execedsync(`curl -L -o ${filename[i]} ${driver}`);
    }

    for(const file of filename) {
        if(file.endsWith('.exe')) {
            await execedsync(file);
        } else if(file.endsWith('.zip')) {
            await execedsync(`Powershell -Command "Expand-Archive \\"${__dirname}\\${file}\\" \\"${__dirname}\\${file.split('.')[0]}\\"`);
            if(file == 'Wireless.zip') await execedsync('cd Wireless && PNPINST64.exe');
            else if(file === 'IRST.zip') await execedsync('cd IRST && AsRSTInstaller.exe');
            else if(file === 'Graphics.zip') await execedsync('cd Graphics && Install.cmd');
            else if(file === 'Card-Reader.zip') await execedsync('cd Card-Reader && Install.bat');
            else if(file === 'Touchpad.zip') await execedsync('cd Touchpad && Install_PTP.bat');
            else if(file === 'ATK.zip') await execedsync('cd ATK && Setup.exe');
            else if(file === 'WinFlash.zip') await execedsync('cd WinFlash && setup.exe');
            else if(file === 'Biometric.zip') await execedsync('cd Biometric && Install.bat');
        }
    }
    log('info', 'Finished installing all drivers :)');
    return true;
};

/**
 * @returns {Promise<Boolean>}
 */
const AsusX407UARCheck = async () => {
    const pcModel = await (await execedsync('WMIC BIOS Get BIOSVersion')).replace('BIOSVersion', '');
    if(pcModel.includes('X407UAR')) return true;
    return false;
};

/**
 * @returns {Promise<Boolean>}
 */
const AsusX407UARWithConfig = async () => {
    const config = require('../../config.json');
    const check = await AsusX407UARCheck();
    if(!config.AsusX407UAR || typeof config.AsusX407UAR != 'boolean' || !check) {
        log('info', 'Either you don\'t have an AsusX407UAR, or you haven\'t set the config.json properly. Either way, I shall not install drivers for you.');
        return false;
    }
    await AsusX407UAR();
    return true;
};

/**
 * @returns {Promise<Boolean>}
 */
const AsusX407UARWithoutConfig = async () => {
    const check = await AsusX407UARCheck();
    if(!check) {
        log('Info', 'I see that you don\'t have an Asus X407UAR. Therefore, I shall not be installing drivers for you');
        return false;
    }
    const driver = await questions('Do you want to install drivers for your Asus X407UAR?');
    if(driver.charAt(0) != 'y') {
        log('result', 'Ok returning');
        return false;
    }
    await AsusX407UAR();
    return true;
};

module.exports = {
    AsusX407UARWithConfig,
    AsusX407UARWithoutConfig,
};
