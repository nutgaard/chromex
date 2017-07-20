const utils = require('./utils');

utils.copyStaticFiles('app');
utils.copyStaticFiles('extension');

utils.createBundler('./src/app-index.js', './app-dist/index.js', false);
utils.createBundler('./src/extension-index.js', './extension-dist/index.js', false);

