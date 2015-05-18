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

var path = require('path');
var fs = require('fs');
var os = require('os');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.log('You called the AppverseHtml5 QR subgenerator.');
        this.conflicter.force = true;
    },

    writing: function () {
        var qrJS = os.EOL +
            '    <!-- QR MODULE -->' + os.EOL +
            '    <script src="bower_components/qrcode/lib/qrcode.min.js"></script>' + os.EOL +
            '    <script src="bower_components/angular-qr/angular-qr.min.js"></script>';


        var indexPath = this.destinationPath('app/index.html');
        var index = this.readFileAsString(indexPath);
        var indexTag = 'app-states.js"></script>';
        var output = index;

        if (index.indexOf("qrcode") === -1) {
            var pos = index.lastIndexOf(indexTag) + indexTag.length;
            output = [index.slice(0, pos), qrJS, index.slice(pos)].join('');
        }
        if (output.length > index.length) {
            fs.writeFileSync(indexPath, output);
            this.log('Writing index.html by the QR generator.');
        }
    }
});
