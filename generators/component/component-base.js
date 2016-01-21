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
var chalk = require('chalk');
var cheerio = require('cheerio');
var os = require('os');
var appverseHTML5Generator = require('../generator-base');

var componentGenerator = appverseHTML5Generator.extend({
/**
 *
 * This method rewrites the yeoman.help()  generator/lib/actions/help.js
 * The help() outputs the USAGE file if exists.
 * This method adds dynamic help from the modules.json.
 *
 */
 help: function help() {
    this.components = require('./config/components.json');
    this.log(chalk.bgBlack.white(os.EOL + " Usage: yo appverse-html5:component [<component>] [<option>]"));
    this.log(chalk.bgBlack.white(" Available component list:"));
    this.components.forEach(function (e) {
        var required_options = "";
        var optional_options = "";
        if (e.option) {
            if (e.option.required) {
            e.option.required.forEach(function (o) {
               required_options += " --" + o + "=[value] ";
            });
          }
            if (e.option.optional) {
               optional_options = " optional: ";
               e.option.optional.forEach(function (o) {
               optional_options += " --" + o + "=[value] ";
            });
          }
             console.log("\t" + chalk.bgBlack.cyan(e.name) + " " + chalk.bgBlack.green(required_options) + " " + chalk.bgBlack.yellow(optional_options) );
            if (e.types) {
                 console.log(chalk.bgBlack.yellow("\t     Valid types: " + e.types));
            }
        } else {
            console.log("\t" + chalk.bgBlack.cyan(e.name));
        }
    });
    return "";
},
/**
* Check if target component exists
* @param {string} target - Component name
**/
validateTarget : function validateTarget (target) {
    var fullTarget = 'app/components/' + target + '/' + target + '.html';
    return this.fs.exists(this.destinationPath (fullTarget));
},
/**
 * Link generated html to target view
 * @param {string} template - Template
 * @param {string} name - Name
 * @param {string} target - Target
 **/
 addToTargetView : function addToTargetView(template, name, target) {
    var includePath = this.resolveNamedTemplatePath(template, name, target);
    var replacement = new RegExp('\\bapp/\\b', 'g');
    var res = includePath.replace(replacement, '');
    var include = '<div class=\"row\"><div class=\"col-lg-12\"><div ng-include src=\"\'' + res + '\'\"></div></div></div>';
    var targetPath = this.destinationPath('app/components/' + target + '/' + target + '.html');
    var targetView = this.fs.read(targetPath);
    var targetHTML = cheerio.load(targetView);
    targetHTML('div').eq(0).append(include);
    this.fs.write(targetPath, targetHTML.html());
},
/**
 * Add named scripts to index
 * @param {string[]} scripts - Scripts to add
 * @param {string} name - Name
 * @param {string} target - Target
 **/
 namedScripts : function namedScripts(scripts, name, target) {
    var namedScriptsArray = [];
    scripts.forEach(function (script) {
        namedScriptsArray.push(this.resolveNamedTemplatePath(script, name, target));
    }.bind(this));
    this.addScriptsToIndex(namedScriptsArray);
},
/**
 * Add Routing
 * @param {string} name - rounting name
 **/
addRouteState : function addRouteState(name) {
    //STATES
    var hook = '$stateProvider',
        path = this.destinationPath('app/states/app-states.js'),
        file = this.fs.read(path),
        insert = ".state('" + name + "', {url: '/" + name + "',templateUrl: 'components/" + name + "/" + name + ".html',controller: '" + name + "Controller'})";

    if (file.indexOf(insert) === -1) {
        var pos = file.lastIndexOf(hook) + hook.length;
        var output = [file.slice(0, pos), insert, file.slice(pos)].join('');
        this.fs.write(path, output);
    }
},
/**
 * Add Link to NAV Bar.
 * @param {string} name - rounting name
 **/
addLinkToNavBar : function addLinkToNavBar(name) {
    var indexPath = this.destinationPath('app/index.html');
    var index = this.fs.read(indexPath);
    var indexHTML = cheerio.load(index);
    //ADD LINK
    var findlink = indexHTML('*[ui-sref="' + name + '"]');
    if (require('lodash').isEmpty(findlink)) {
        var navLink = '<li data-ng-class="{active: $state.includes(\'' + name + '\')}"><a angular-ripple ui-sref="' + name + '"><i class=" glyphicon glyphicon-globe"></i> ' + name + '</a></li>';
        indexHTML('ul.nav.navbar-nav').append(navLink);
    }
    this.fs.write(indexPath, indexHTML.html());
    this.addRouteState(name);
},
/**
 * ADD Drop Down to NAV
 * @param {string} name - Dropdown name
 **/
 addDropDownOption : function addDropDownOption(name) {
    var indexPath = this.destinationPath('app/index.html');
    var index = this.fs.read(indexPath);
    var indexHTML = cheerio.load(index);
    //ADD LINK
    var findlink = indexHTML('*[ui-sref="' + name + '"]');
    if (require('lodash').isEmpty(findlink)) {
        var findDropdown = indexHTML("a.dropdown-toggle:contains('" + this.menu + "')");
        //FIND THE DROPDOWN
        if (require('lodash').isEmpty(findDropdown)) {
            this.info(" Dropdown menu " + this.menu + " not found > Adding dropdown menu. ");
            //NOT EXISTS
            var htmlCode = '<li class="dropdown"><a angular-ripple class="dropdown-toggle" data-toggle="dropdown"><i class="glyphicon glyphicon-list-alt"></i> ' + this.menu + '<span class="caret"></span></a><ul class="dropdown-menu"><li data-ng-class="{active: $state.includes(\'' + name + '\')}"><a angular-ripple ui-sref="' + name + '"><i class=" glyphicon glyphicon-globe"></i> ' + name + '</a></li></ul></li>';
            this.info(" Adding new option " + name + " to dropdown menu. ");
            indexHTML('ul.nav.navbar-nav').append(htmlCode);
        } else {
            this.info(" Dropdown menu found. ");
            //EXISTS
            this.info(" Adding new option " + name + " to dropdown menu. ");
            var navLink = '<li data-ng-class="{active: $state.includes(\'' + name + '\')}"><a angular-ripple ui-sref="' + name + '"><i class=" glyphicon glyphicon-globe"></i> ' + name + '</a></li>';
            indexHTML(findDropdown).next().append(navLink);
        }
        this.fs.write(indexPath, indexHTML.html());
        this.addRouteState(name);
    }
}
});

module.exports = componentGenerator;
