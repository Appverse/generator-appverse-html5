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
var estraverse = require('estraverse');
var esprima = require('esprima');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.argument('entity', {
            required: true,
            type: String,
            desc: 'The entity name'
        });

        this.log('You called the AppverseHtml5 Entity REST subgenerator.' + this.entity);
        utils.checkVersion();
        //CHECK IF REST IS AVAILABLE
        var path = this.destinationPath('app/scripts/app.js');
        var file = this.readFileAsString(path);
        //PARSE FILE
        var astCode = esprima.parse(file);
        var restModule = false;

        estraverse.traverse(astCode, {
            enter: function (node) {
                if (node.type === 'Literal' && node.value === 'appverse.rest') {
                    console.log("REST module found.");
                    restModule = true;
                    this.break();
                }
            }
        });
        this.restModule = restModule;
    },
    configuring: function () {
        //TODO
        //This is done async, the next writing code is executed this one have finished
        /* if (!this.restModule) {
             console.log("REST module not found. Adding Appverse - HTML5 REST ");
             this.composeWith('appverse-html5:rest', {
                 options: {}
             });
         } */
    },

    writing: {
        writeCode: function () {
            if (this.restModule) {
                var htmlRestDirective = '<div rest rest-path="' + this.entity + '" rest-name="' + this.entity + 's" rest-loading-text="Loading ' + this.entity + '"  rest-error-text="Error while loading ' + this.entity + '"></div>';

                var htmlRestList = '<ul id="' + this.entity + '"><li ng-repeat="' + this.entity + ' in ' + this.entity + 's"><p><strong>ID:</strong> {{' + this.entity + '.id}}</p><p><strong>Name:</strong> {{' + this.entity + '.name}}</p></li></ul></div>';

                var code = htmlRestDirective + htmlRestList;

                //CHECK IF MOCK SERVER IS PRESENT
                var pkgPath = this.destinationPath('package.json');
                this.pkg = JSON.parse(this.readFileAsString(pkgPath));
                if (!_.isUndefined(this.pkg.devDependencies['json-server'])) {
                    //WRITE MOCK JSON
                    var mockentity = [{
                        id: 0,
                        name: "mockname"
                }];

                    fs.writeFileSync('api/' + this.entity + '.json', JSON.stringify(mockentity));
                }
                this.composeWith('appverse-html5:app-view', {
                    options: {
                        name: this.entity,
                        htmlcontent: code
                    }
                });
            } else {
                console.log("REST module not found.");
                console.log("Execute 'yo appverse-html5:rest' to add the REST module to the project.");
            }
        }
    },
    end: function () {
        console.log("Finish.");
    }
});
