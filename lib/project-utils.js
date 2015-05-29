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
var updateNotifier = require('update-notifier');
var pkg = require('../package.json');
var chalk = require('chalk');
var cheerio = require('cheerio');
var _ = require('lodash');
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var request = require('request');
var os = require('os');


//
// Get the Generated angular application name
//
function getApplicationName(context) {
    //APP NAME
    var pkgPath = context.destinationPath('package.json');
    var pkg = JSON.parse(context.readFileAsString(pkgPath));
    return pkg.name + "App";
}

/**
 * Check if angular module is loaded
 **/
var checkAngularModule = function (moduleName) {
    //CHECK IF moduleName IS AVAILABLE
    var path = this.destinationPath('app/scripts/app.js');
    var file = this.readFileAsString(path);
    //PARSE FILE
    var astCode = esprima.parse(file);
    var installedModule = false;
    var generator = this;

    estraverse.traverse(astCode, {
        enter: function (node) {
            if (node.type === 'Literal' && node.value === moduleName) {
                generator.log("Module found.");
                installedModule = true;
                this.break();
            }
        }
    });
    return installedModule;
};
/**
 * ADD angular module
 **/
var addAngularModule = function (moduleName) {
    if (!checkAngularModule.call(this, moduleName)) {
        //ANGULAR MODULES
        this.log('Writing angular modules (app.js).');
        var path = this.destinationPath('app/scripts/app.js');
        var file = this.readFileAsString(path);
        //PARSE FILE
        var astCode = esprima.parse(file);
        //ANGULAR MODULE
        var angularModule = {
            type: "Literal",
            value: moduleName,
            raw: "'" + moduleName + "'"
        };
        //APP NAME
        var appName = getApplicationName(this);
        //REPLACE JS
        var moduleCode = estraverse.replace(astCode, {
            enter: function (node, parent) {
                if (node.type === 'Literal' && node.value === appName) {
                    parent.arguments[1].elements.unshiftIfNotExist(angularModule, function (e) {
                        return e.type === angularModule.type && e.value === angularModule.value;
                    });
                    this.break();
                }
            }
        });
        var finalCode = escodegen.generate(moduleCode);
        fs.writeFileSync(path, finalCode);
    } else {
        this.log("Module already installed");
    }
};
/**
 * ADD Routing
 **/
var addRouteState = function () {
    //STATES
    var hook = '$stateProvider',
        path = this.destinationPath('app/scripts/states/app-states.js'),
        file = this.readFileAsString(path),
        insert = ".state('" + this.viewName + "', {url: '/" + this.viewName + "',templateUrl: 'views/" + this.viewName + "/" + this.viewName + ".html',controller: '" + this.controllerName + "'})";

    if (file.indexOf(insert) === -1) {
        var pos = file.lastIndexOf(hook) + hook.length;
        var output = [file.slice(0, pos), insert, file.slice(pos)].join('');
        fs.writeFileSync(path, output);
    }
};
/**
 * ADD View and Controller files
 **/
var addViewAndControllerFiles = function () {
    this.fs.copyTpl(
        this.templatePath('/app/views/view/view.html'),
        this.destinationPath('/app/views/' + this.name + '/' + this.name + '.html'),
        this
    );
    this.fs.copyTpl(
        this.templatePath('/app/scripts/controllers/view-controller.js'),
        this.destinationPath('/app/scripts/controllers/' + this.controllerScript),
        this
    );
};
/**
 * ADD Controller Scripts to Index
 **/
var addControllerScriptToIndex = function () {
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
        var controllerJS = os.EOL + '    <script src="scripts/controllers/' + this.controllerScript + '"></script>';
        indexHTML(controllerJS).insertAfter(indexHTML('script').get()[indexHTML('script').length - 1]);
    }
    fs.writeFileSync(indexPath, indexHTML.html());

};
/**
 * ADD Link to NAV Bar.
 **/
var addLinkToNavBar = function () {
    var indexPath = this.destinationPath('app/index.html');
    var index = this.readFileAsString(indexPath);
    var indexHTML = cheerio.load(index);
    //ADD LINK
    var findlink = indexHTML('*[ui-sref="' + this.viewName + '"]');
    if (_.isEmpty(findlink)) {
        var navLink = '<li data-ng-class="{active: $state.includes(\'' + this.viewName + '\')}"><a ui-sref="' + this.viewName + '">' + this.viewName + '</a></li>';
        indexHTML('ul.nav.navbar-nav').append(navLink);
    }
    fs.writeFileSync(indexPath, indexHTML.html());
    addRouteState.call(this);
};

/**
 * ADD Drop Down to NAV
 **/
var addDropDownOption = function () {
    var indexPath = this.destinationPath('app/index.html');
    var index = this.readFileAsString(indexPath);
    var indexHTML = cheerio.load(index);
    //ADD LINK
    var findlink = indexHTML('*[ui-sref="' + this.viewName + '"]');
    if (_.isEmpty(findlink)) {
        var findDropdown = indexHTML("a.dropdown-toggle:contains('" + this.menu + "')");
        //FIND THE DROPDOWN
        if (_.isEmpty(findDropdown)) {
            this.log(" Dropdown menu " + this.menu + " not found > Adding dropdown menu. ");
            //NOT EXISTS
            var htmlCode = '<li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown"><i class="glyphicon glyphicon-list-alt"></i> ' + this.menu + '<span class="caret"></span></a><ul class="dropdown-menu"><li data-ng-class="{active: $state.includes(\'' + this.viewName + '\')}"><a ui-sref="' + this.viewName + '">' + this.viewName + '</a></li></ul></li>';
            this.log(" Adding new option " + this.viewName + " to dropdown menu. ");
            indexHTML('ul.nav.navbar-nav').append(htmlCode);
        } else {
            this.log(" Dropdown menu found. ");
            //EXISTS
            this.log(" Adding new option " + this.viewName + " to dropdown menu. ");
            var navLink = '<li data-ng-class="{active: $state.includes(\'' + this.viewName + '\')}"><a ui-sref="' + this.viewName + '">' + this.viewName + '</a></li>';
            indexHTML(findDropdown).next().append(navLink);
        }
        fs.writeFileSync(indexPath, indexHTML.html());
        addRouteState.call(this);
    }
};

/**
 * ADD View and Controller
 **/
var addViewAndController = function () {
    this.viewName = this.name;
    this.controllerScript = this.name + '-controller.js';
    this.controllerName = this.name + 'Controller';
    if (_.isEmpty(this.menu)) {
        addLinkToNavBar.call(this);
    } else {
        addDropDownOption.call(this);
    }
    addControllerScriptToIndex.call(this);
    addViewAndControllerFiles.call(this);
};

/**
 * CHECK Generator Version
 **/
var checkVersion = function () {
    var notifier = updateNotifier({
        pkg: pkg,
        updateCheckInterval: 1000 // Interval to check for updates.
    });

    if (notifier && notifier.update) {
        this.log(chalk.cyan('Update available: ') + chalk.bold.green(notifier.update.latest) + chalk.gray(' \(current ') + chalk.bold.gray(notifier.update.current) + chalk.gray('\)'));
        this.log(chalk.cyan('run ' + chalk.bold.white('npm update -g generator-appverse-html5') + chalk.cyan(' to update \n')));
    }
};



module.exports = {
    checkVersion: checkVersion,
    getApplicationName: getApplicationName,
    addLinkToNavBar: addLinkToNavBar,
    addControllerScriptToIndex: addControllerScriptToIndex,
    addViewAndController: addViewAndController,
    addAngularModule: addAngularModule,
    checkAngularModule: checkAngularModule,
    addDropDownOption: addDropDownOption,
    addViewAndControllerFiles: addViewAndControllerFiles
};
