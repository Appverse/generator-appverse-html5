'use strict';
var util = require('util');
var path = require('path');
var fs = require('fs');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var pkg = require("../package.json");
var _ = require('lodash');
var os = require('os');
var updateNotifier = require('update-notifier');
var ZSchema = require('z-schema');
var request = require('request');
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
 * Find build for prompting on start
 *
 */
Generator.prototype.promptBuilds = function promptBuilds(buildConfig) {
    var modules = require(buildConfig);
    var prompts = [];
    for (var i = 0; i < modules.length; i++) {
        if (modules[i].startprompt) {
            prompts.push(modules[i].startprompt);
        }
    }
    return prompts;
};

/**
 *
 * Find modules for prompting on start
 *
 */
Generator.prototype.promptModules = function promptModules(modulesConfig) {
    var modules = require(modulesConfig);
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
            path.join(base, file),
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
            path.join(base, template),
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
    this.log("Adding packages ");
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
        this.info("Dependencies already exists at " + file);
    }
};
/**
 * Add scripts to package.json
 @ package
 @ file
 @ node
 */
Generator.prototype.addScriptsToPackage = function addScriptsToPackage(scripts) {
    var pkg = require(this.destinationPath('package.json'));
    var write = false;
    scripts.forEach(function (s) {
        pkg.scripts[s.name] = s.value;
        write = true;
    });
    if (write) {
        this.fs.write(this.destinationPath('package.json'), JSON.stringify(pkg));
    } else {
        this.info("Scripts already exists at package.json");
    }
};

/**
 * Check required arguments
 * Rewrite the method to beatufiy the error message.
 **/
Generator.prototype.checkRequiredArgs = function () {
    // If the help option was provided, we don't want to check for required
    // arguments, since we're only going to print the help message anyway.
    if (this.options.help) {
        return;
    }

    // Bail early if it's not possible to have a missing required arg
    if (this.args.length > this._arguments.length) {
        return;
    }

    this._arguments.forEach(function (arg, position) {
        // If the help option was not provided, check whether the argument was
        // required, and whether a value was provided.
        if (arg.config.required && position >= this.args.length) {
            this.warning('Did not provide required argument ' + chalk.bold(arg.name) + '!');
            return;
        }
    }, this);
};


/* JSON SCHEMA  'Accept': 'application/schema+json' */
Generator.prototype.readJSONSchemaFileOrUrl = function readJSONSchemaFileOrUrl(url, callback) {
    if (/^https?:/.test(url)) {
        var options = {
            url: url,
            headers: {
                'Accept': 'application/schema+json'
            }
        };
        request(options, function (error, response, body) {
            if (response.statusCode === 404) {
                callback(error, null);
                return;
            }
            if (!error && response.statusCode === 200) {
                callback(null, JSON.parse(body.toString()));
            } else {
                callback(error, null);
            }
        });
        return;
    }
    if (!fs.existsSync(url)) {
        callback("Wrong Path. I can't find a JSON file there!", null);
    }
    callback(null, JSON.parse(fs.readFileSync(url, 'utf8')));
};

//Read JSON from file or URL
Generator.prototype.readJSONFileOrUrl = function readJSONFileOrUrl(url, callback) {
    if (/^https?:/.test(url)) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                callback(null, JSON.parse(body.toString()));
            } else {
                callback(error, null);
            }
        });
        return;
    }
    if (!fs.existsSync(url)) {
        this.log("JSON URL: " + url);
        callback("Wrong Path. I can't find a JSON file there!", null);
    }
    callback(null, JSON.parse(fs.readFileSync(url, 'utf8')));
};

//Validate JSON against schema
Generator.prototype.validateJson = function validateJson(json, tpath, callback) {
    var validator = new ZSchema();
    this.schema = JSON.parse(fs.readFileSync(path.join(tpath, '../schema/appverse-project-schema.json'), 'utf-8'));
    var valid = validator.validate(json, this.schema);
    if (!valid) {
        callback("Sorry. Not a valid JSON project! ", null);
        callback("Check the project-schema.json for a valid JSON file. \n", null);
        callback(JSON.stringify(this.schema), null);
    }
    callback(null, true);
};

function parseJSONcomponents() {}
