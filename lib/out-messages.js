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
var helpInfo = require("../app/help/help.json");
var pkg = require("../package.json");
var chalk = require('chalk');

var logo = function () {
    console.log(chalk.bgBlack.cyan('\n' +
        '                 __    __                    \n' +
        '   __ _ _ __  _ _\\ \\  / /__ _ __ ___  ___    \n' +
        '  / _| | |_ \\| |_ \\ \\/ / _ | |__/ __|/ _ \\   \n' +
        ' | (_| | |_) | |_) \\  /  __| |  \\__ |  __/   \n' +
        '  \\__|_| .__/| .__/ \\/ \\___|_|  |___/\\___|   \n' +
        '       | |   | |                             \n' +
        '       |_|   |_|                             \n' +
        '                                    ' + 'v' + pkg.version + '\n \n'));

    // Have Yeoman greet the user.
    console.log(
        ' Welcome to the ' + chalk.bgBlack.cyan('Appverse Html5') + ' generator! \n'
    );
}
var help = function () {
    logo();
    console.log(chalk.bgBlack.gray(" Usage:"));
    helpInfo.usage.forEach(function (e) {
        console.log("\t" + chalk.bgBlack.white(e) + "\n");
    });
    console.log("\n " + chalk.bgBlack.gray("Args:"));
    helpInfo.args.forEach(function (e) {
        console.log("\t" + chalk.bgBlack.green(e.name) + " " + chalk.bgBlack.white(e.help));
    });
    console.log("\n " + chalk.bgBlack.gray("Options:"));
    helpInfo.options.forEach(function (e) {
        console.log("\t" + chalk.bgBlack.green(e.flag) + " [" + chalk.bgBlack.white(e.type) + "] " + chalk.bgBlack.white(e.help));
    });
    console.log("\n " + chalk.bgBlack.gray("Subgenerators:"));
    helpInfo.subgenerators.forEach(function (e) {
        console.log("\t" + chalk.bgBlack.cyan(e.name) + " " + chalk.bgBlack.white(e.help));
        if (e.args) {
            console.log("\t" + chalk.bgBlack.yellow("    Args:"));
            e.args.forEach(function (e) {
                console.log("\t        " + chalk.bgBlack.green(e.name) + " " + chalk.bgBlack.white(e.help));
            });
        }
        if (e.options) {
            console.log(chalk.bgBlack.yellow("\t" + "    Options:"));
            e.options.forEach(function (e) {
                console.log("\t        " + chalk.bgBlack.green(e.flag) + " [" + chalk.bgBlack.white(e.type) + "] " + chalk.bgBlack.white(e.help));
            });

        }
        console.log("\n");
    });
};


module.exports = {
    help: help,
    logo: logo

};
