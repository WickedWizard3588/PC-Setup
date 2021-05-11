const { execSync } = require('child_process');
const { createInterface } = require('readline');
const input = process.stdin;
const output = process.stdout;

/**
 * @param {String} command
 * @returns {Promise<String>}
 */
const execedsync = async (command) => {
    const data = await execSync(command).toString();
    return data;
};

/**
 * @param {String} type
 * @param {String} text
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
 * @param {String} what
 * @returns {Promise<String>}
 */
const questions = (what) => {
    const rl = createInterface({
        input,
        output,
    });
    return new Promise((resolve) => {
        rl.question('\033[34m' + what, (answer) => {
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