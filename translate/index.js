/*
 Copyright (c) 2012 GFT Appverse, S.L., Sociedad Unipersonal.
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
var fs = require('fs');
var os = require('os');
var utils = require('../lib');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.conflicter.force = true;
        utils.projectutils.checkVersion.call(this);
    },
    writing: function () {
        var translateJS = os.EOL +
            '    <!-- TRANSLATE MODULE -->' + os.EOL +
            '    <script src="bower_components/angular-translate/angular-translate.min.js"></script>' + os.EOL +
            '    <script src="bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js"></script>' + os.EOL +
            '    <script src="bower_components/angular-dynamic-locale/src/tmhDynamicLocale.js"></script>' + os.EOL +
            '    <script src="bower_components/appverse-web-html5-core/dist/appverse-translate/appverse-translate.min.js"></script>';

        var indexPath = this.destinationPath('app/index.html');
        var index = require("html-wiring").readFileAsString(indexPath);
        var indexTag = 'app-states.js"></script>';
        var output = index;

        if (index.indexOf("api-translate.js") === -1) {
            var pos = index.lastIndexOf(indexTag) + indexTag.length;
            output = [index.slice(0, pos), translateJS, index.slice(pos)].join('');
        }
        if (output.length > index.length) {
            fs.writeFileSync(indexPath, output);
            this.log('Writing index.html by the Translate generator');
        }
    },
    projectFiles: function () {
        //ANGULAR MODULES
        var hook = '\'App.Controllers\'',
            path = this.destinationPath('app/scripts/app.js'),
            file = require("html-wiring").readFileAsString(path),
            insert = ", 'appverse.translate'";
        if (file.indexOf(insert) === -1) {
            var pos = file.lastIndexOf(hook) + hook.length;
            var output = [file.slice(0, pos), insert, file.slice(pos)].join('');
            //this.writeFileFromString(path, output);
            fs.writeFileSync(path, output);
        }
        this.fs.copy(
            this.templatePath('app/resources/i18n'),
            this.destinationPath('app/resources/i18n')
        );
    }
});
