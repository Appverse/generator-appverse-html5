/*global $:true */
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
var fs = require('fs');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.argument('entity', {
            required: true,
            type: String,
            desc: 'The entity name'
        });

        this.argument('menu', {
            required: false,
            type: String,
            desc: 'The Dropdown menu name'
        });


        this.log('You called the AppverseHtml5 Entity REST subgenerator. Entity: ' + this.entity);
        utils.checkVersion();
        this.restModule = utils.checkAngularModule.call(this, 'appverse.rest');
        this.name = this.entity;
    },
    configuring: function () {
        //ADD NG_GRID ANGULAR
        utils.addAngularModule.call(this, 'ngGrid');
    },
    writing: {
        writeCode: function () {
            if (this.restModule) {
                if (!_.isUndefined(this.name)) {
                    utils.addViewAndController.call(this);
                }
                //CHECK IF MOCK SERVER IS PRESENT
                var pkgPath = this.destinationPath('package.json');
                this.pkg = JSON.parse(this.readFileAsString(pkgPath));
                if (!_.isUndefined(this.pkg.devDependencies['json-server'])) {
                    //WRITE MOCK JSON
                    var mockentity = [{
                        id: 0,
                        name: "mockname"
                }];
                    fs.writeFileSync('api/' + this.name + '.json', JSON.stringify(mockentity));
                }
            } else {
                console.log("Execute 'yo appverse-html5:rest' to add the REST module to the project.");
            }
        }
    },
    end: function () {
        console.log("Finish.");
    }
});
