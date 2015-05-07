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
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.log('You called the AppverseHtml5 Cache subgenerator.');
        this.conflicter.force = true;
    },
    writing: function () {
        var restJS = '<!-- CACHE MODULE -->' +
            '<script src="bower_components/angular-cache/dist/angular-cache.min.js"></script>' +
            '<script src="bower_components/appverse-web-html5-core/dist/appverse-cache/appverse-cache.min.js"></script>';

        var indexPath = this.destinationPath('app/index.html');
        var index = this.readFileAsString(indexPath);
        var indexTag = 'app-states.js"></script>';
        var output = index;
        var pos;

        if (index.indexOf("appverse-cache.js") === -1) {
            pos = index.lastIndexOf(indexTag) + indexTag.length;
            output = [index.slice(0, pos), restJS, index.slice(pos)].join('');
        }
        if (output.length > index.length) {
            fs.writeFileSync(indexPath, output);
            this.log('Writing index.html by the Cache generator.');
        }

        //ANGULAR MODULES
        var hook = '\'App.Controllers\'',
            path = this.destinationPath('app/scripts/app.js'),
            file = this.readFileAsString(path),
            insert = ", 'appverse.cache'";
        if (file.indexOf(insert) === -1) {
            pos = file.lastIndexOf(hook) + hook.length;
            output = [file.slice(0, pos), insert, file.slice(pos)].join('');
            //this.writeFileFromString(path, output);
            fs.writeFileSync(path, output);
        }
    }
});
