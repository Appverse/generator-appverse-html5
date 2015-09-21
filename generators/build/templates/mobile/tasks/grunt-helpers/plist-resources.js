'use strict';
var plist      = require('plist');
var fs         = require('fs');
var url        = require('url');
var _          = require('lodash');
var Promise    = require('promise');

module.exports =  function(options) {
    return new PListResources(options);
};

var defaultOptions = {
    pListFile : '',
    iOSPath : '',
};

function PListResources(options) {
    options = setOptions(options);

    /**
     * Downloads all files in the specified path
     */
    this.extract = function() {
        return getResourcesFromPListFile(options.pListFile);
    };

    function getResourcesFromPListFile(filePath) {
        var originalPlistFile = fs.readFileSync(filePath, 'utf8');
        var plistObj = plist.parse(originalPlistFile);
        return plistObj.items[0].assets.map(prepareResource);
    }

    function prepareResource(asset) {
        var urlParts = url.parse(asset.url, false);
        return  { url: urlParts.path, downloadAs: options.iOSPath + '/' + getFileNameFromURLParam(urlParts.query) };
    }

    function getFileNameFromURLParam(url) {
        var pattern = /.+=(\S+)/;
        var match = pattern.exec(url);
        return match[1];
    }

    function setOptions(options) {
        return _.extend(defaultOptions, options);
    }

}
