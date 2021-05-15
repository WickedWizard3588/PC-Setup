const { execSync } = require('child_process');

/**
 * @param {String} command
 * @returns {Promise<String>}
 */
const execedsync = async (command) => {
    let data;
    try {
        data = await execSync(command).toString();
    } catch(e) {
        data = e;
    }
    return data;
};

/**
 * @param {String} type
 * @param {String} text
 * @returns {void}
 */
const log = (type, text) => {
    type = type.toLowerCase();
    const types = {
        info: '\033[32m',
        result: '\033[94m',
        error: '\033[41m',
    };
    if(!types[type]) throw new Error(`${type} doesn't exist in logging`);
    console.log(`${types[type]}${text}`);
    console.log('\033[0m');
};

/**
 * @param {String} question
 * @returns {Promise<String>}
 */
const questions = (question) => {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question('\033[34m' + question.trim() + '\033[39m\n', (answer) => {
            rl.close();
            resolve(answer.toLowerCase());
        });
    });
};

module.exports = {
    execedsync,
    log,
    questions,
};
