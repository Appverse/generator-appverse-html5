'use strict';
/**
 * Mounts a folder in a connect server
 */
module.exports = function mountFolder(connect, dir) {
    return connect.static(require('path').resolve(dir));
};

