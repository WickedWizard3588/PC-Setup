const { questions, log } = require('.');
const { writeFileSync } = require('fs');
const { join } = require('path');

/**
 * @param {Array<String>|Boolean} apps
 * @param {Number|Boolean} wsl
 * @param {Array<String>|Boolean} cmder
 * @param {Array<String|Boolean>|Boolean} ffmpeg
 * @returns {Promise<Boolean>}
 */
const writeConfig = (apps, wsl, cmder, ffmpeg) => {
    let template = {};
    return new Promise((resolve) => {
        questions('Do you want me to write a config.json for you?').then(async (answer) => {
            if(answer.charAt(0) == 'y') {
                log('Info', 'Writing a config.json :)');
                if(typeof apps != 'boolean') template = { ...template, "apps": [...apps] };
                if(typeof wsl != 'boolean') template = { ...template, "wsl": { "default-version": wsl, "upgrade": wsl == 2 ? true : false } }
                if(typeof cmder != 'boolean') template = { ...template, "cmder": { "finalDirectory": cmder[0], "environmentVariables": cmder[1], "global": cmder[2], "context-menu": cmder[3] } };
                if(typeof ffmpeg != 'boolean') template = { ...template, "ffmpeg": { "finalDirectory": ffmpeg[0], "environmentVariables": ffmpeg[1], "global": ffmpeg[2] } }
                writeFileSync(join(process.cwd(), './config.json'), JSON.stringify(template, null, 2));
                resolve(true);
            } else {
                log('Info', 'Ok, I will not write a config.json');
                resolve(true);
            }
        });
    });
};

module.exports = {
    writeConfig,
};