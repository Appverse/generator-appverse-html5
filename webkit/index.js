/*
 Copyright (c) 2015 GFT Appverse, S.L., Sociedad Unipersonal.
 This Source Code Form is subject to the terms of the Appverse Public License
 Version 2.0 (“APL v2.0”). If a copy of the APL was not distributed with this
 file, You can obtain one at http://www.appverse.mobi/licenses/apl_v2.0.pdf. [^]
 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the conditions of the AppVerse Public License v2.0
 are met.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. EXCEPT IN CASE OF WILLFUL MISCONDUCT OR GROSS NEGLIGENCE, IN NO EVENT
 SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT(INCLUDING NEGLIGENCE OR OTHERWISE)
 ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 POSSIBILITY OF SUCH DAMAGE.
 */

/*jshint -W069 */

'use strict';
var yeoman = require('yeoman-generator');
var utils = require('../utils.js');
var fs = require('fs');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
        utils.checkVersion.call(this);
        //CONFIG
        this.option('interactiveMode');

        if (!_.isUndefined(this.options['interactiveMode'])) {
            this.log(this.options['interactiveMode']);
            this.interactiveMode = this.options['interactiveMode'];
        } else {
            this.interactiveMode = true;
        }
    },
    initializing: function () {
        this.conflicter.force = true;
        this.option('config', {
            desc: 'JSON COnfiguration',
            type: Object
        });
        this.package.webkit = this.options['config'];
        if (_.isUndefined(this.package.webkit)) {
            this.package.webkit.plattform = ['win', 'linux', 'osx'];
        }
    },
    prompting: function () {
        var done = this.async();
        var prompts = [];
        if (this.interactiveMode) {
            prompts = [{
                type: "confirm",
                name: "webkit",
                message: "Do you want to package your application as a desktop application using Node-Webkit?",
                default: false
        }];
        } else {
            prompts = [];
        }
        this.prompt(prompts, function (answers) {
            if (prompts.length > 0) {
                this.webkit = answers.webkit;
            } else {
                this.webkit = false;
            }
            done();
        }.bind(this));
    },
    writing: function () {

        if (this.webkit) {
            this.fs.copy(
                this.templatePath('config/nodewebkit.js'),
                this.destinationPath('config/nodewebkit.js')
            );
            this.fs.copy(
                this.templatePath('tasks/webkit.js'),
                this.destinationPath('tasks/webkit.js')
            );

            var packagePath = this.destinationPath('package.json');
            var pkg = require(packagePath);
            pkg.scripts["start"] = "nodewebkit ./dist";
            fs.writeFileSync(packagePath, JSON.stringify(pkg));
        }

    },
    installingDeps: function () {
        if (this.webkit) {
            this.npmInstall(['grunt-node-webkit-builder'], {
                'saveDev': true,
                'saveExact': true
            });
            this.npmInstall(['node-webkit-builder'], {
                'saveDev': true,
                'saveExact': true
            });
            this.npmInstall(['nodewebkit'], {
                'saveDev': true,
                'saveExact': true
            });
        }
    },
    end: function () {
        if (this.webkit) {
            this.log("\n Your application is ready to use node-webkit.");
            this.log("\n Execute: 'npm start' to run your dist with webkit.");
            this.log("\n Execute: 'grunt nodewebkit' to package the dist application as an executable package.");
            this.log("\n Execute: 'grunt nodewebkit:dist' to create the dist and packe the application as an executable package.");
            this.log("Package will be created under 'webkitbuilds' folder.");
        }
    }
});
