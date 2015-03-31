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
var pkg = require('./package.json');
var chalk = require('chalk');

function checkVersion() {
    var notifier = updateNotifier({
        pkg: pkg,
        updateCheckInterval: 1000 // Interval to check for updates.
    });
    if (notifier.update) {
        console.log(chalk.cyan('Update available: ') + chalk.bold.green(notifier.update.latest) + chalk.gray(' \(current ') + chalk.bold.gray(notifier.update.current) + chalk.gray('\)'));
        console.log(chalk.cyan('run ' + chalk.bold.white('npm update -g generator-appverse-html5') + chalk.cyan(' to update \n')));
    }
};

// check if an element exists in array using a comparer function
// comparer : function(currentElement)
Array.prototype.inArray = function (comparer) {
    for (var i = 0; i < this.length; i++) {
        if (comparer(this[i])) return true;
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
//
// Get the Generated angular application name
//
function getApplicationName(context) {
    //APP NAME
    var pkgPath = context.destinationPath('package.json');
    var pkg = JSON.parse(context.readFileAsString(pkgPath));
    return pkg.name + "App";
}

module.exports = {
    checkVersion: checkVersion,
    getApplicationName: getApplicationName
};
