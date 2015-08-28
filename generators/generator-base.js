'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var pkg = require("../package.json");
var _ = require('lodash');
var os = require('os');
var updateNotifier = require('update-notifier');
var Generator = yeoman.generators.Base;

/*
 * ADD SCRIPTS FROM MODULE TO INDEX:HTML
 */
Generator.prototype.welcome = function welcome() {
    this.log(chalk.bgBlack.cyan('\n' +
        '                 __    __                    \n' +
        '   __ _ _ __  _ _\\ \\  / /__ _ __ ___  ___    \n' +
        '  / _| | |_ \\| |_ \\ \\/ / _ | |__/ __|/ _ \\   \n' +
        ' | (_| | |_) | |_) \\  /  __| |  \\__ |  __/   \n' +
        '  \\__|_| .__/| .__/ \\/ \\___|_|  |___/\\___|   \n' +
        '       | |   | |                             \n' +
        '       |_|   |_|                             \n' +
        '                                    ' + 'v' + pkg.version + '\n \n'));

    // Have Yeoman greet the user.
    this.log(
        ' Welcome to the ' + chalk.bgBlack.cyan('Appverse Html5') + ' generator! ' + os.EOL
    );
};

/**
 * CHECK Generator Version
 **/
Generator.prototype.checkVersion = function checkVersion() {
    var notifier = updateNotifier({
        pkg: pkg,
        updateCheckInterval: 1000 // Interval to check for updates.
    });

    if (notifier && notifier.update) {
        this.log(chalk.cyan('Update available: ') + chalk.bold.green(notifier.update.latest) + chalk.gray(' \(current ') + chalk.bold.gray(notifier.update.current) + chalk.gray('\)'));
        this.log(chalk.cyan('run ' + chalk.bold.white('npm update -g generator-appverse-html5') + chalk.cyan(' to update \n')));
    }
};
/*
 * WARNING MESSAGE - RED
 */
Generator.prototype.warning = function warning(message) {
    this.log(chalk.bgBlack.red(os.EOL + message + os.EOL));
};
/*
 * INFO MESSAGE - Green
 */
Generator.prototype.info = function warning(message) {
    this.log(chalk.bgBlack.green(os.EOL + message));
};
/*
 * Get the Generated angular application name
 */
Generator.prototype.getApplicationName = function getApplicationName() {
    //APP NAME
    var pkgPath = this.destinationPath('package.json');
    var pkg = JSON.parse(this.fs.read(pkgPath));
    return pkg.name + "App";
};

// check if an element exists in array using a comparer function
// comparer : function(currentElement)
Array.prototype.inArray = function (comparer) {
    for (var i = 0; i < this.length; i++) {
        if (comparer(this[i])) {
            return true;
        }
    }
    return false;
};

// adds an element to the array if it does not already exist using a comparer
// function
Array.prototype.pushIfNotExist = function (element, comparer) {
    if (!this.inArray(comparer)) {
        this.push(element);
    }
};

// adds an element to the array if it does not already exist using a comparer
// function
Array.prototype.unshiftIfNotExist = function (element, comparer) {
    if (!this.inArray(comparer)) {
        this.unshift(element);
    }
};

/**
 *
 * Find module by name from the available module list
 *
 */
Generator.prototype.findModule = function findModule(nameKey, modules) {
    for (var i = 0; i < modules.length; i++) {
        if (modules[i].name === nameKey) {
            return modules[i];
        }
    }
};

/**
 *
 * Find modules for prompting on start
 *
 */
Generator.prototype.promptModules = function promptModules() {
    var modules = require("./module/modules.json");
    var prompts = [];
    for (var i = 0; i < modules.length; i++) {
        if (modules[i].startprompt) {
            var p = {
                name: _.capitalize(modules[i].name),
                value: modules[i].name,
                checked: false
            }
            prompts.push(p);
        }
    }
    return prompts;
};
/**
 * Move files to target path
 *
 **/
Generator.prototype.moveFiles = function moveFiles(base, files) {
    files.forEach(function (file) {
        this.fs.copy(
            this.templatePath(path.join(base, file)),
            this.destinationPath(file)
        );
    }.bind(this));
};
/**
 * Fill and Move templates to target path
 *
 **/
Generator.prototype.moveTemplates = function moveTemplates(base, templates) {
    templates.forEach(function (template) {
        this.fs.copyTpl(
            this.templatePath(path.join(base, template)),
            this.destinationPath(template),
            this
        );
    }.bind(this));
};
/**
 * Add package to dependency manager  (package.json, bower.json)
 @ package list
 @ file
 @ node
 */
Generator.prototype.addPackage = function addPackage(packages, file, node) {
    var manager = require(this.destinationPath(file));
    var write = false;
    packages.forEach(function (p) {
        if (!manager[node][p.name]) {
            manager[node][p.name] = p.version;
            write = true;
        }
    });
    if (write) {
        this.fs.write(this.destinationPath(file), JSON.stringify(manager));
    } else {
        this.info("Dependency already exists at " + file);
    }
};
