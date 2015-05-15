'use strict';
var https   = require('https');
var fs      = require('fs');
var _       = require('lodash');
var Promise = require('promise');


var defaultOptions = {
    host : '',
    port : 443,
    baseUrl : '',
    rejectUnauthorized : false,
};

/**
 * Downloads the mobile dist files from the builder server
 */
module.exports = function Downloader(options) {
    var downloadPath, requests, resources;
    options = setOptions(options);

    /**
     * Set resources to download,
     * @param  {array} customResources Each resource is in the form of:
     *   { url: 'relativeURL', downloadAs: 'localRelativePath' }
     */
    this.resources = function(customResources) {
        resources = customResources;
        return this;
    };

    /**
     * Downloads all files in the specified path
     */
    this.inFolder = function(path) {
        downloadPath = path;
        requests = resources.map(constructRequest);
        return downloadAll(requests);
    };


    function setOptions(options) {
        return _.extend(defaultOptions, options);
    }

    function constructRequest(resource) {
        return {
            options: {
                host: options.host,
                port: options.port,
                path: options.baseUrl + resource.url,
                rejectUnauthorized: options.rejectUnauthorized,
            },
            downloadAs : resource.downloadAs
        };
    }

    function downloadAll(requests) {
        return Promise.all( requests.map(download) );
    }

    function download(request) {
        return new Promise(function (fulfill, reject) {
            https.get(request.options, receiveResponse)
                .on('error', reject);

            function receiveResponse(res) {
                var fileName = downloadPath + request.downloadAs;
                console.log(fileName);
                var file = fs.createWriteStream(fileName);
                res.pipe(file);
                res.on('end', fulfill);
            }
        });
    }
};










