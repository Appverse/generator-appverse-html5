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
var utils = require('../utils.js');
var _ = require('lodash');
var cheerio = require('cheerio');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.conflicter.force = true;
        this.argument('name', {
            required: false,
            type: String,
            desc: 'The View name'
        });
        this.option('htmlcontent', {
            desc: 'Code ',
            type: String,
            default: 'default'
        });
        this.option('name', {
            desc: 'The View name',
            type: String,
            default: 'default'
        });

        if (!_.isUndefined(this.name)) {
            this.viewName = this.name;
            this.controllerScript = this.name + '-controller.js';
            this.controllerName = this.name + 'Controller';
        }
        if (!_.isUndefined(this.options['name'])) {
            this.viewName = this.options['name'];
            this.controllerScript = this.options.name + '-controller.js';
            this.controllerName = this.options.name + 'Controller';
        }

        if (!_.isUndefined(this.options['htmlcontent'])) {
            this.htmlCode = this.options['htmlcontent'];
        }
        utils.checkVersion();
        this.log('You called the AppverseHtml5 View subgenerator with the argument ' + this.viewName + '.');
    },
    writing: {
        files: function () {
            var indexPath = this.destinationPath('app/index.html');
            var index = this.readFileAsString(indexPath);
            var indexHTML = cheerio.load(index);
            //CHECK IF EXISTS
            var seen = false;
            for (var i = 0; i < indexHTML('script').length; i++) {
                if (indexHTML('script').get()[i].attribs.src === 'scripts/controllers/' + this.controllerScript) {
                    seen = true;
                }
            }
            if (!seen) {
                var controllerJS = '\n<script src="scripts/controllers/' + this.controllerScript + '"></script>\n';
                indexHTML(controllerJS).insertAfter(indexHTML('script').get()[indexHTML('script').length - 1]);
            }

            var findlink = indexHTML('*[ui-sref="' + this.viewName + '"]');
            if (_.isEmpty(findlink)) {
                var navLink = '<li data-ng-class="{active: $state.includes(\'' + this.viewName + '\')}"><a ui-sref="' + this.viewName + '">' + this.viewName + '</a></li>';
                indexHTML('ul.nav.navbar-nav').append(navLink);
            }

            fs.writeFileSync(indexPath, indexHTML.html());

            //STATES
            //TODO - USE ESPRIMA FOR JS PARSING
            var hook = '$stateProvider',
                path = this.destinationPath('app/scripts/states/app-states.js'),
                file = this.readFileAsString(path),
                insert = ".state('" + this.viewName + "', {url: '/" + this.viewName + "',templateUrl: 'views/" + this.viewName + "/" + this.viewName + ".html',controller: '" + this.controllerName + "'})";

            if (file.indexOf(insert) === -1) {
                var pos = file.lastIndexOf(hook) + hook.length;
                var output = [file.slice(0, pos), insert, file.slice(pos)].join('');
                fs.writeFileSync(path, output);
            }

            this.fs.copyTpl(
                this.templatePath('/app/views/view/view.html'),
                this.destinationPath('/app/views/' + this.viewName + '/' + this.viewName + '.html'),
                this
            );
            this.fs.copyTpl(
                this.templatePath('/app/scripts/controllers/view-controller.js'),
                this.destinationPath('/app/scripts/controllers/' + this.controllerScript),
                this
            );
        }
    },
    conflicts: function () {
        if (!_.isUndefined(this.options['htmlcontent'])) {
            var viewPath = this.destinationPath('/app/views/' + this.viewName + '/' + this.viewName + '.html');
            var entityFile = this.readFileAsString(viewPath);
            var entityHTML = cheerio.load(entityFile);
            entityHTML('.well').append(this.htmlCode);
            fs.writeFileSync(viewPath, entityHTML.html());
        }
    }

});
