'use strict';
var yeoman = require('yeoman-generator');
var request = require('request');
var syncrequest = require('sync-request');
var utils = require('../utils.js');
var fs = require('fs');
var pkg = require('../package.json');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
        utils.checkVersion();
        this.themeprompts = [];
    },
    initializing: function () {
        this.log('You called the Appverse Html5 - Bootstrap Theme subgenerator.');
        this.conflicter.force = true;
        this.log(" Getting themes from http://bootswatch.com ");
        var res = syncrequest('GET', 'http://api.bootswatch.com/3/');
        this.remotethemes = JSON.parse(res.body.toString());
        var prompts = {
            type: 'list',
            name: 'themes',
            message: "Select bootswatch theme:",
            choices: []
        };
        this.remotethemes.themes.forEach(function (entry) {
            var option = entry.name;
            prompts.choices.push(option);
        });
        this.themeprompts.push(prompts);
    },
    prompting: function () {
        var done = this.async();
        this.prompt(this.themeprompts, function (props) {
            this.selectedTheme = props.themes;
            done();
        }.bind(this));
    },
    writing: function () {
        function search(nameKey, myArray) {
            for (var i = 0; i < myArray.length; i++) {
                if (myArray[i].name === nameKey) {
                    return myArray[i];
                }
            }
        };
        var theme = search(this.selectedTheme, this.remotethemes.themes);
        request(theme.scss, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("Rewriting bootswatch.scss");
                fs.writeFileSync('app/styles/theme/_bootswatch.scss', body);
                console.log("Done.");
            } else {
                console.log("Connection error.");
            }
        });

        request(theme.scssVariables, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("Rewriting variables.scss");
                fs.writeFileSync('app/styles/theme/_variables.scss', body);
                console.log("Done.");
            } else {
                console.log("Connection error.");
            }
        });
    }
});
