/*
 * grunt-reload-chrome
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 Rob Halff
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');
 var path = require('path');
var Chrome = require('chrome-remote-interface');

var devices = undefined;

module.exports = function (grunt) {

    function chrome(options, done) {

        var conf = {
            host: options.host,
            port: options.port,
            device: options.device
        };
        Chrome(conf, function (chrome) {
            var selectedDevice = conf.device;
            if (selectedDevice) {
                chrome.port = conf.port;
                chrome.Network.setUserAgentOverride({
                    userAgent: selectedDevice.userAgent
                });
                chrome.Page.setDeviceMetricsOverride({
                    width: selectedDevice.width,
                    height: selectedDevice.height,
                    deviceScaleFactor: selectedDevice.deviceScaleFactor,
                    mobile: selectedDevice.mobile,
                    fitWindow: true
                });

                chrome.Page.setTouchEmulationEnabled({
                    enabled: selectedDevice.touch,
                    configuration: selectedDevice.mobile == true ? "mobile" : "Desktop"
                })

                chrome.on('Page.loadEventFired', function (evt) {
                    console.log('load event fired')
                    chrome.DOM.getDocument(null, function (err, resp) {});
                    chrome.DOM.getOuterHTML({
                        nodeId: 1
                    }, function (err, resp) {
                        var jsonstring = JSON.stringify(resp);
                        var home = JSON.parse(jsonstring);
                        var html = JSON.stringify(home.outerHTML);
                        var newtitle = JSON.stringify(selectedDevice.title);
                        chrome.DOM.setOuterHTML({
                            nodeId: 11,
                            outerHTML: '<div> ' + selectedDevice.title + ' </div>'
                        });
                    });
                });

                chrome.Debugger.enable();
                chrome.DOM.enable();
                chrome.Network.enable();
                chrome.Page.enable();
                chrome.Page.navigate({
                    url: options.url
                });

                chrome.on('error', function (err) {
                    console.error('Cannot connect to Chrome');
                    done(true);
                });

            } else {
                console.error('Device not found');
            }
        });
    };

    grunt.registerTask('setEmulatedDevice', 'set up the emulated window.', function () {
        //Prepare Devices list;
         var manifestFolder = path.join(__dirname, "../manifest");
         var devices = [];

         grunt.file.recurse(manifestFolder, function (abspath, rootdir, subdir, filename) {
             if (subdir) {
                 if (filename === 'package.json') {
                     var manifest = require("../manifest/" + subdir + "/package.json");
                     var debugPort = manifest['chromium-args'];
                     var debugPortSplit = debugPort.split("=");
                     var device = {
                         device: manifest.device,
                         port: debugPortSplit[1]
                     };
                     devices.push(device);
                 }
                 console.log('devices:'+devices)
             }
         });

        //Process devices array
        devices.forEach(function (device) {
            var done = this.async();
            var options = this.options({
                url: 'http://127.0.0.1:9000',
                match: undefined,
                port: device.port,
                host: 'localhost',
                device: device.device
            });

            if (!options.url) {
                grunt.fail.warn('You need to specify a url to open');
                return false;
            }
            grunt.verbose.writeflags(options, 'Options');
            chrome(options, done);
        }.bind(this));
    });

};
