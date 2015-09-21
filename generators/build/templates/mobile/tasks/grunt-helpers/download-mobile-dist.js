'use strict';
var _                       = require('lodash');
var Downloader              = require('./downloader');
var plistResources          = require('./plist-resources');

/**
 * Downloads the mobile dist files from the builder server
 */
module.exports =  function(options) {
    return new MobileDistDownloader(options);
};

var defaultOptions = {
    host : '',
    port : 443,
    appName : '',
    baseUrl : '',
    rejectUnauthorized : false,
    windowsBuilder : false
};

// Relative paths of resources to download.
// {appName} will be replace by the actual app.name
// Routes are relative to the download path
var resources = [
    { url: '?htmlfile={appName}.html', downloadAs: '/index.html' },
    { url: '/{appName}.plist', downloadAs: '/ios/{appName}.plist' },
    { url: '/{appName}.apk', downloadAs: '/android/{appName}.apk' },
    { url: '/', downloadAs: '/build-result-encripted.zip' },
];
// For windows, resources are different
var windowsResources = [
    { url: '/', downloadAs: '/windows/build-result-encripted.zip' },
];

function MobileDistDownloader(options) {
    var downloadPath;
    options = setOptions(options);

    /**
     * Downloads the resources specified above.
     * Then, it looks up in the plist file for more resources and downloads them too.
     * @param {string} path Path were all resources will be downloaded
     */
    this.downloadIn = function(path) {
        downloadPath = path;
        if (options.windowsBuilder) {
            return donwloadWindowsResources();
        } else {
            return donwloadResources().then(downloadPlistResources);
        }
    };

    function donwloadResources() {
        var namedResources = resources.map(setAppNames);
        var download = new Downloader(options);
        return download.resources(namedResources).inFolder(downloadPath);
    }

    function donwloadWindowsResources() {
        var namedResources = windowsResources.map(setAppNames);
        var download = new Downloader(options);
        return download.resources(namedResources).inFolder(downloadPath);
    }

    function downloadPlistResources() {
        var resources = plistResources({
                pListFile : downloadPath + '/ios/' + options.appName + '.plist',
                iOSPath : '/ios'
            }).extract();

        // base URL is not needed here as URLS extracted from pList are full
        var iosResourcesDownloadOptions = options;
        iosResourcesDownloadOptions.baseUrl = '';

        var download = new Downloader(iosResourcesDownloadOptions);
        return download.resources(resources).inFolder(downloadPath);
    }

    function setOptions(options) {
        return _.extend(defaultOptions, options);
    }

    function setAppNames(resource) {
        resource.url = replaceAppName(resource.url, options.appName);
        resource.downloadAs = replaceAppName(resource.downloadAs, options.appName);
        return resource;
    }

    function replaceAppName(str, appName) {
        return str.replace('{appName}', appName);
    }
}










