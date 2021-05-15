const { questions, log } = require('.');
const { writeFileSync } = require('fs');
const { join } = require('path');

/**
 * @param {Array<String>|Boolean} apps
 * @param {Array<Number|Boolean>|Boolean} wsl
 * @param {Array<String>|Boolean} cmder
 * @param {Array<String|Boolean>|Boolean} ffmpeg
 * @param {Boolean|String} systemRestore
 * @param {Boolean|String} intelDSA
 * @param {Boolean} intelRST
 * @param {Boolean} asusx407uar
 * @returns {Promise<Boolean>}
 */
const writeConfig = async (apps, wsl, cmder, ffmpeg, systemRestore, intelDSA, intelRST, asusx407uar) => {
    let template = {};
    const answer = await questions('Do you want me to write a config.json for you?');
    if(answer.charAt(0) != 'y') {
        log('Info', 'Ok, I will not write a config.json');
        return true;
    }
    log('Info', 'Writing a config.json :)');
    if(typeof apps != 'boolean') template = { ...template, "apps": [...apps] };
    if(typeof wsl != 'boolean') template = { ...template, "wsl": { "default-version": wsl[0], "upgrade": wsl[0] == 2 ? true : false }, "ubuntu": wsl[1] };
    if(typeof cmder != 'boolean') template = { ...template, "cmder": { "finalDirectory": cmder[0], "environmentVariables": cmder[1], "global": cmder[2], "context-menu": cmder[3] } };
    if(typeof ffmpeg != 'boolean') template = { ...template, "ffmpeg": { "finalDirectory": ffmpeg[0], "environmentVariables": ffmpeg[1], "global": ffmpeg[2] } };
    if(typeof systemRestore != 'string') template = { ...template, "systemRestore": true };
    if(typeof intelDSA != 'string') template = { ...template, "IntelDSA": true };
    if(intelRST) template = { ...template, "IntelRST": true };
    if(asusx407uar) template = { ...template, "AsusX407UAR": true };
    writeFileSync(join(process.cwd(), './config.json'), JSON.stringify(template, null, 2));
    return true;
};

module.exports = {
    writeConfig,
};
