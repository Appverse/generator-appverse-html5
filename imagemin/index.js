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

'use strict';
var yeoman = require('yeoman-generator');
var utils = require('../lib');
var _ = require('lodash');
var os = require('os');
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
        utils.projectutils.checkVersion.call(this);
    },
    initializing: function () {
        this.conflicter.force = true;
        utils.projectutils.checkVersion.call(this);
        //CONFIG
        this.option('interactiveMode');
        if (!_.isUndefined(this.options['interactiveMode'])) {
            this.interactiveMode = this.options['interactiveMode'];
        } else {
            this.interactiveMode = true;
        }
    },

    prompting: function () {
        var done = this.async();
        var prompts = [];
        if (this.interactiveMode == true) {
            prompts = [
                {
                    type: "confirm",
                    name: "imagemin",
                    message: "Do you want to install imagemin?",
                    default: false
            }
        ];
        } else {
            prompts = [];
        }
        this.prompt(prompts, function (props) {
            if (prompts.length > 0) {
                this.imagemin = props.imagemin;
            } else {
                this.imagemin = false;
            }
            done();
        }.bind(this));
    },
    writing: function () {
        if (this.imagemin) {
            this.fs.copy(
                this.templatePath('config/concurrent.js'),
                this.destinationPath('config/concurrent.js')
            );

            this.fs.copy(
                this.templatePath('config/imagemin.js'),
                this.destinationPath('config/imagemin.js')
            );
        }
    },
    install: function () {
        if (this.imagemin) {
            var packagePath = this.destinationPath('package.json');
            //this.npmInstall () is not working with skip-install
            var pkg = require(packagePath);
            pkg.devDependencies["download"] = "3.3.0";
            pkg.devDependencies["bin-build"] = "2.1.1";
            pkg.devDependencies["bin-wrapper"] = "2.1.3";
            pkg.devDependencies["logalot"] = "2.1.0";
            pkg.devDependencies["through2"] = "0.6.5";
            pkg.devDependencies["gifsicle"] = "2.0.1";
            pkg.devDependencies["jpegtran-bin"] = "2.0.2";
            pkg.devDependencies["optipng-bin"] = "2.0.4";
            pkg.devDependencies["pngquant-bin"] = "2.0.3";
            pkg.devDependencies["imagemin-gifsicle"] = "4.1.0";
            pkg.devDependencies["imagemin-jpegtran"] = "4.1.0";
            pkg.devDependencies["imagemin-optipng"] = "4.2.0";
            pkg.devDependencies["imagemin-pngquan"] = "4.0.0";
            pkg.devDependencies["imagemin"] = "3.1.0";
            pkg.devDependencies["grunt-contrib-imagemin"] = "0.9.4";
            fs.writeFileSync(packagePath, JSON.stringify(pkg));
        }
    },
    installingDeps: function () {
        if (this.imagemin) {
            this.installDependencies({
                skipInstall: this.options['skip-install']
            });
        }
    },
    end: function () {
        if (this.imagemin) {
            this.log(os.EOL + "Your application is ready to use imagemin.");
            this.log(os.EOL + " Execute: 'grunt dist' to create the dist folder with all the images optimized.");
        }

    }
});
