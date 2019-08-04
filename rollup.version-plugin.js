import fs from 'fs';


export default function(opts = {}) {
    const version = opts.version || '';
    const versionFilePath = opts.path || '';

    return {
        name: 'run',

        generateBundle(outputOptions, bundle, isWrite) {
            if (!isWrite) {
                this.error('rollup version plugin works with written bundles');
            }

            fs.writeFileSync(versionFilePath, JSON.stringify({
                version: version
            }));
        }
    }
};


export function getVersion() {
    const d = new Date();

    const year = d.getFullYear();

    let month = d.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }

    let day = d.getDate();
    if (day < 10) {
        day = `0${day}`;
    }

    let hours = d.getHours();
    if (hours < 10) {
        hours = `0${hours}`;
    }

    let minutes = d.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    let seconds = d.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
