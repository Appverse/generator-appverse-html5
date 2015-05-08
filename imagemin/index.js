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
var utils = require('../utils.js');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
        utils.checkVersion.call(this);
    },
    initializing: function () {
        this.log('You called the AppverseHtml5 Imagemin subgenerator.');
        this.conflicter.force = true;
    },
    prompting: function () {
        var done = this.async();
        var prompts = [
            {
                type: "confirm",
                name: "imagemin",
                message: "Do you want to install imagemin?",
                default: false
            }
        ];
        this.prompt(prompts, function (props) {
            this.imagemin = props.imagemin;
            done();
        }.bind(this));
    },
    writing: function () {

        if (!this.imagemin) {
            return;
        }

        this.fs.copy(
            this.templatePath('config/concurrent.js'),
            this.destinationPath('config/concurrent.js')
        );

        this.fs.copy(
            this.templatePath('config/imagemin.js'),
            this.destinationPath('config/imagemin.js')
        );
    },
    install: function () {

        if (!this.imagemin || this.options['skip-install']) {
            return;
        }

        this.npmInstall([
                'download@3.3.0',
                'bin-build@2.1.1',
                'bin-wrapper@2.1.3',
                'logalot@2.1.0',
                'through2@0.6.5'
            ], {
            saveDev: true
        });

        this.npmInstall([
                'gifsicle@2.0.1',
                'jpegtran-bin@2.0.2',
                'optipng-bin@2.0.4',
                'pngquant-bin@2.0.3',
                'imagemin-gifsicle@4.1.0',
                'imagemin-jpegtran@4.1.0',
                'imagemin-optipng@4.2.0',
                'imagemin-pngquant@4.0.0',
                'imagemin@3.1.0',
                'grunt-contrib-imagemin@0.9.4'
            ], {
            saveDev: true
        });

    },
    end: function () {
        if (!this.imagemin) {
            return;
        }
        this.log("\n Your application is ready to use imagemin.");
        this.log("\n Execute: 'grunt dist' to create the dist folder with all the images optimized.");
    }
});
