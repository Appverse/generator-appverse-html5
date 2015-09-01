'use strict';
var util = require('util');
var path = require('path');
var chalk = require('chalk');
var cheerio = require('cheerio');
var fs = require('fs');
var os = require('os');

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
    this.log(chalk.bgBlack.white(os.EOL + " Usage: yo appverse-html5:build [buildType]" + os.EOL));
    this.log(chalk.bgBlack.white(" Available build type list:"));
    require('./build.json').forEach(function (e) {
        console.log("\t" + chalk.bgBlack.cyan(e.name));
    });
    return "";
};
