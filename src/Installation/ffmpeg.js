const { execedsync, log, questions } = require('../Functions');
const { readdirSync } = require('fs');

/**
 * @param {String} finalDirectory
 * @param {Boolean} environmentVariables
 * @param {Boolean} envGlobal
 * @param {String} systemVars
 * @param {String} userVars
 * @returns {Promise<Array<String|Boolean>>}
 */
const ffmpeg = (finalDirectory, environmentVariables, envGlobal, systemVars, userVars) => {
    log('info', 'I will be installing 7-Zip, a Tool for extracting 7z files. You can uninstall it through a prompt later :)');
    return new Promise((resolve) => {
        execedsync('curl -L -o ffmpeg.7z https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-full.7z').then(async (result) => {
            log('result', result);
            await execedsync('choco install 7zip');
            const programFiles = await (await execedsync('echo %ProgramFiles%')).trim();
            await execedsync(`"${programFiles}\\7-Zip\\7z.exe" x "${__dirname}\\ffmpeg.7z" *.* "${__dirname}"`);
            readdirSync(__dirname).forEach(async (dir) => {
                if(!dir.startsWith('ffmpeg-')) return;
                await execedsync(`robocopy "${dir}" "${finalDirectory}" /E /V /MOVE`);
                await execedsync('echo Y | del ffmpeg.7z');
            });
            if(!environmentVariables) return [
                finalDirectory,
                false,
                false,
            ];
            await execedsync(`setx PATH "${envGlobal ? systemVars : userVars}${finalDirectory}\\bin" ${envGlobal ? '/m' : ''}`);
            const zip = await questions('Do you want to uninstall 7-Zip?');
            if(zip.charAt(0) === 'y') await execedsync('choco uninstall 7zip');
            resolve([
                finalDirectory,
                environmentVariables,
                envGlobal,
            ]);
        });
    });
};

/**
 * @param {String} systemVars
 * @param {String} userVars
 * @returns {Promise<Boolean>}
 */
const installFFmpegWithConfig = async (systemVars, userVars) => {
    const config = require('../../config.json');
    if(!config.ffmpeg || Object.keys(config.ffmpeg).length === 0 || typeof config.ffmpeg != 'object' || !config.ffmpeg.finalDirectory) {
        log('Error', 'config.ffmpeg either doesn\'t exist, or it isn\'t of type Object or is an empty Object, or the final directory doesn\'t exist');
        return true;
    }
    const ffmpged = await ffmpeg(
        config.ffmpeg.finalDirectory,
        config.ffmpeg.environmentVariables,
        config.ffmpeg.global,
        systemVars,
        userVars,
    );
    return ffmpged;
};

/**
 * @param {String} systemVars
 * @param {String} userVars
 * @returns {Promise<Boolean|Array<String|Boolean>>}
 */
const installFFmpegWithoutConfig = async (systemVars, userVars) => {
    const answer = await questions('Do you want to install FFmpeg');
    if(answer.charAt(0) === 'y') {
        const finalDirectory = await questions('Where should the FinalDirectory for FFmpeg be?');
        let environmentVariables = await questions('Should I set the Environment Variables for FFmpeg? (Y/N)');
        environmentVariables = environmentVariables.charAt(0) === 'y' ? true : false;
        let envGlobal = await questions('Should the Environment Variables be set as Global');
        envGlobal = envGlobal.charAt(0) === 'y' ? true : false;
        const returned = await ffmpeg(finalDirectory, environmentVariables, envGlobal, systemVars, userVars);
        return returned;
    }
    log('info', 'I will not install FFmpeg then :)');
    return true;
};

module.exports = {
    installFFmpegWithConfig,
    installFFmpegWithoutConfig,
};
