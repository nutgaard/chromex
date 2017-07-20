const fs = require('fs');
const rimraf = require('rimraf');
const copy = require('copyfiles');
const path = require('path');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');

function getTime() {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function logUpdate(output) {
    const logRegex = /(\d+).*?\((.*)\)/;
    return (msg) => {
        const [ _, bytes, time ] = logRegex.exec(msg);
        console.log(`${bytes} bytes writte to ${output} (${time}) at ${getTime()}`)
    }

}

function createBundler(indexFile, outputFile, dev) {
    const plugins = dev ? [ watchify ] : [];
    const bundler = browserify({
        entries: [indexFile],
        cache: {},
        packageCache: {},
        plugin: plugins
    }).transform(babelify);

    function bundle() {
        bundler.bundle().pipe(fs.createWriteStream(outputFile));
    }

    bundler.on('update', bundle);
    bundler.on('log', logUpdate(outputFile));

    !dev && console.log(`Starting bundler for ${indexFile}`);
    bundle();

    return bundle;
}

function copyStaticFiles(type /* app or extension */) {
    const commons = path.join('.', 'staticfiles', '*.*');
    const specifics = path.join('.', 'staticfiles', type, '*.*');
    const dist = path.join('.', `${type}-dist`);

    console.log(`Cleanup ${dist}`);
    rimraf.sync(dist);
    fs.mkdirSync(dist);

    console.log(`Copying static files for ${type}`);
    copy([commons, dist], { up: true }, () => {});
    copy([specifics, dist], { up: true }, () => {});
}

module.exports = {
    createBundler,
    copyStaticFiles
};