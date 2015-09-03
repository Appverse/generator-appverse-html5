'use strict';
var util = require('util');
var path = require('path');
var chalk = require('chalk');
var cheerio = require('cheerio');
var _ = require('lodash');
var fs = require('fs');
var os = require('os');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var yeoman = require('yeoman-generator');
var gen = require('../generator-base');

var Generator = yeoman.generators.Base;

/**
 *
 * This method rewrites the yeoman.help()  generator/lib/actions/help.js
 * The help() outputs the USAGE file if exists.
 * This method adds dynamic help from the modules.json.
 *
 */
Generator.prototype.help = function help() {
    this.log(chalk.bgBlack.white(os.EOL + " Usage: yo appverse-html5:component [component] [option]"));
    this.log(chalk.bgBlack.white(" Available component list:"));
    this.components.forEach(function (e) {
        if (e.option) {
            console.log("\t" + chalk.bgBlack.cyan(e.name));
            e.option.forEach(function (o) {
                console.log(chalk.bgBlack.cyan(o + "=[value]"));
            });
        } else {
            console.log("\t" + chalk.bgBlack.cyan(e.name));
        }
    });
    return "";
};
/**
 *
 */
Generator.prototype.resolveNamedTemplatePath = function resolveNamedTemplatePath(template, name) {
    var replacement = new RegExp('\\b' + this.componentName + '\\b', 'g')
    var res = template.replace(replacement, name);
    return res;
};

/**
 * Link generated html to target view
 *
 **/
Generator.prototype.addToTargetView = function addToTargetView(template, name, target) {
    var includePath = this.resolveNamedTemplatePath(template, name);
    var replacement = new RegExp('\\bapp/\\b', 'g');
    var res = includePath.replace(replacement, '');
    var include = '<div class=\"row\"><div class=\"col-lg-12\"><div ng-include src=\"\'' + res + '\'\"></div></div></div>';
    var targetPath = this.destinationPath('app/views/' + target + '/' + target + '.html');
    var targetView = this.fs.read(targetPath);
    var targetHTML = cheerio.load(targetView);
    targetHTML('.container').append(include);
    this.fs.write(targetPath, targetHTML.html());
};
/**
 * Move Named template
 *
 */
Generator.prototype.moveNamedTemplate = function moveNamedTemplate(template, name) {
    this.name = name;
    this.lodash = _;
    var base = path.join(this.templatepath, this.componentName);
    this.fs.copyTpl(
        path.join(base, template),
        this.destinationPath(this.resolveNamedTemplatePath(template, name)),
        this
    );
};
/**
 * Fill and Move named templates to target path
 *
 **/
Generator.prototype.moveNamedTemplates = function moveNamedTemplates(templates, name) {
    templates.forEach(function (template) {
        this.moveNamedTemplate(template, name);
    }.bind(this));
};
/**
 * Add named scripts to index
 *
 **/
Generator.prototype.namedScripts = function namedScripts(scripts, name) {
    var namedScripts = [];
    scripts.forEach(function (script) {
        namedScripts.push(this.resolveNamedTemplatePath(script, name));
    }.bind(this));
    this.addScriptsToIndex(namedScripts);
};
/**
 * ADD Routing
 **/
Generator.prototype.addRouteState = function addRouteState(name) {
    //STATES
    var hook = '$stateProvider',
        path = this.destinationPath('app/scripts/states/app-states.js'),
        file = this.fs.read(path),
        insert = ".state('" + name + "', {url: '/" + name + "',templateUrl: 'views/" + name + "/" + name + ".html',controller: '" + name + "Controller'})";

    if (file.indexOf(insert) === -1) {
        var pos = file.lastIndexOf(hook) + hook.length;
        var output = [file.slice(0, pos), insert, file.slice(pos)].join('');
        this.fs.write(path, output);
    }
};
/**
 * ADD Link to NAV Bar.
 **/
Generator.prototype.addLinkToNavBar = function addLinkToNavBar(name) {
    var indexPath = this.destinationPath('app/index.html');
    var index = this.fs.read(indexPath);
    var indexHTML = cheerio.load(index);
    //ADD LINK
    var findlink = indexHTML('*[ui-sref="' + name + '"]');
    if (_.isEmpty(findlink)) {
        var navLink = '<li data-ng-class="{active: $state.includes(\'' + name + '\')}"><a angular-ripple ui-sref="' + name + '">' + name + '</a></li>';
        indexHTML('ul.nav.navbar-nav').append(navLink);
    }
    this.fs.write(indexPath, indexHTML.html());
    this.addRouteState(name);
};
/**
 * ADD Drop Down to NAV
 **/

Generator.prototype.addDropDownOption = function addDropDownOption(name) {
    var indexPath = this.destinationPath('app/index.html');
    var index = this.fs.read(indexPath);
    var indexHTML = cheerio.load(index);
    //ADD LINK
    var findlink = indexHTML('*[ui-sref="' + name + '"]');
    if (_.isEmpty(findlink)) {
        var findDropdown = indexHTML("a.dropdown-toggle:contains('" + this.menu + "')");
        //FIND THE DROPDOWN
        if (_.isEmpty(findDropdown)) {
            this.log(" Dropdown menu " + this.menu + " not found > Adding dropdown menu. ");
            //NOT EXISTS
            var htmlCode = '<li class="dropdown"><a angular-ripple class="dropdown-toggle" data-toggle="dropdown"><i class="glyphicon glyphicon-list-alt"></i> ' + this.menu + '<span class="caret"></span></a><ul class="dropdown-menu"><li data-ng-class="{active: $state.includes(\'' + name + '\')}"><a angular-ripple ui-sref="' + name + '">' + name + '</a></li></ul></li>';
            this.log(" Adding new option " + name + " to dropdown menu. ");
            indexHTML('ul.nav.navbar-nav').append(htmlCode);
        } else {
            this.log(" Dropdown menu found. ");
            //EXISTS
            this.log(" Adding new option " + name + " to dropdown menu. ");
            var navLink = '<li data-ng-class="{active: $state.includes(\'' + ame + '\')}"><a angular-ripple ui-sref="' + name + '">' + name + '</a></li>';
            indexHTML(findDropdown).next().append(navLink);
        }
        this.fs.write(indexPath, indexHTML.html());
        this.addRouteState(name);
    }
};
