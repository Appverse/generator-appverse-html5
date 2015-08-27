'use strict';
var util = require('util');
var path = require('path');
var chalk = require('chalk');
var cheerio = require('cheerio');
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
    this.log(chalk.bgBlack.white(os.EOL + " Usage: yo appverse-html5:module [module]" + os.EOL));
    this.log(chalk.bgBlack.white(" Available module list:"));
    require('./modules.json').forEach(function (e) {
        console.log("\t" + chalk.bgBlack.cyan(e.name));
    });
    return "";
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

/*
 * ADD SCRIPTS FROM MODULE TO INDEX:HTML
 */
Generator.prototype.addScriptsToIndex = function addScriptsToIndex(scripts) {
    this.log("Adding scripts to index.html");
    var index = this.fs.read(this.destinationPath('app/index.html'));
    var indexHTML = cheerio.load(index);
    var write = false;
    scripts.forEach(function (script) {
        var scriptTag = os.EOL + '<script src=\"' + script + '\"></script>';
        var exists = false;
        for (var i = 0; i < indexHTML('script').length; i++) {
            var current = indexHTML('script').get()[i].attribs.src;
            if (current === script) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            write = true;
            indexHTML(scriptTag).insertAfter(indexHTML('script').get()[indexHTML('script').length - 1]);
        }
    });
    if (write) {
        this.fs.write(this.destinationPath('app/index.html'), indexHTML.html());
    } else {
        this.info("Scripts already exists at index.html");
    }
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
/**
 * Move files to target path
 *
 **/
Generator.prototype.moveFiles = function moveFiles(files) {
    files.forEach(function (file) {
        this.fs.copy(
            this.templatePath(path.join(this.name, file)),
            this.destinationPath(file)
        );
    }.bind(this));
};
/**
 * Fill and Move templates to target path
 *
 **/
Generator.prototype.moveTemplates = function moveTemplates(templates) {
    templates.forEach(function (template) {
        this.fs.copyTpl(
            this.templatePath(path.join(this.name, template)),
            this.destinationPath(template),
            this
        );
    }.bind(this));
};

/**
 * Check if angular module is loaded
 **/
Generator.prototype.checkAngularModule = function (moduleName) {
    //CHECK IF moduleName IS AVAILABLE
    var file = this.fs.read(this.destinationPath('app/scripts/app.js'));
    //PARSE FILE
    var astCode = esprima.parse(file);
    var installedModule = false;
    estraverse.traverse(astCode, {
        enter: function (node) {
            if (node.type === 'Literal' && node.value === moduleName) {
                installedModule = true;
            }
        }
    });
    return installedModule;
};
/**
 * ADD angular module
 **/
Generator.prototype.addAngularModule = function (moduleName) {
    if (!this.checkAngularModule(moduleName)) {
        //ANGULAR MODULES
        this.log('Writing angular modules (app.js).');
        var file = this.fs.read(this.destinationPath('app/scripts/app.js'));
        //PARSE FILE
        var astCode = esprima.parse(file);
        //ANGULAR MODULE
        var angularModule = {
            type: "Literal",
            value: moduleName,
            raw: "'" + moduleName + "'"
        };
        //APP NAME
        var appName = this.getApplicationName();
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
        this.fs.write(this.destinationPath('app/scripts/app.js'), finalCode);
    } else {
        this.info("Angular module already installed");
    }
};

/**
 * Add environment configuration
 */
Generator.prototype.addConfig = function addConfig(configuration) {
    this.log('Writing angular configuration (app.js) by the Rest generator');
    var file = this.fs.read(this.destinationPath('app/scripts/app.js'));
    //PARSE FILE
    var astCode = esprima.parse(file);
    var config = {
        type: 'Property',
        key: {
            type: 'Literal',
            value: configuration.name,
            raw: configuration.name
        },
        computed: false,
        value: {
            type: 'ObjectExpression',
            properties: []
        }
    };
    configuration.values.forEach(function (element) {
        var prop = {
            type: 'Property',
            key: {
                type: 'Literal',
                value: element.name,
                raw: element.name
            },
            computed: false,
            value: {
                type: 'Literal',
                value: element.value,
                raw: element.value
            },
            kind: 'init',
            method: false,
            shorthand: false
        };
        config.value.properties.push(prop);
    });

    var configCode = estraverse.replace(astCode, {
        enter: function (node, parent) {
            if (node.type === 'Identifier' && node.name === 'environment') {
                parent.value.properties.pushIfNotExist(config, function (e) {
                    return e.type === config.type && e.key.value === config.key.value;
                });
            }
        }
    });
    var finalCode = escodegen.generate(configCode);
    this.fs.write(this.destinationPath('app/scripts/app.js'), finalCode);
};
