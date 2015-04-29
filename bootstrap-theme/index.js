'use strict';
var yeoman = require('yeoman-generator');
var request = require('request');
var utils = require('../utils.js');
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
        utils.checkVersion.call(this);

    },
    initializing: function () {
        this.log('You called the Appverse Html5 - Bootstrap Theme subgenerator.');
        this.conflicter.force = true;
        this.log(" Getting themes from http://bootswatch.com ");
        this.themeprompts = [];
        this.remotethemes = {};
        var prompts = {
            type: 'list',
            name: 'themes',
            message: "Select bootswatch theme:",
            choices: []
        };
        var done = this.async();

        request('http://api.bootswatch.com/3', function (error, response, body) {
            if (!error && response.statusCode === 200) {
                this.remotethemes = JSON.parse(body.toString());
                this.remotethemes.themes.forEach(function (entry) {
                    var option = entry.name;
                    prompts.choices.push(option);
                });
                this.themeprompts.push(prompts);
                done();
            } else {
                this.log("Connection error.");
            }
        }.bind(this));

    },
    prompting: function () {
        var done = this.async();
        this.prompt(this.themeprompts, function (props) {
            this.selectedTheme = props.themes;
            done();
        }.bind(this));
    },
    writing: function () {
        var done = this.async();

        function search(nameKey, myArray) {
            for (var i = 0; i < myArray.length; i++) {
                if (myArray[i].name === nameKey) {
                    return myArray[i];
                }
            }
        }
        var theme = search(this.selectedTheme, this.remotethemes.themes);

        var requestsDone = 0;

        var incrementRequestsDone = function () {
            requestsDone += 1;
            if (requestsDone === 2) {
                done();
            }
        };

        request(theme.scss, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                this.log("Rewriting bootswatch.scss");
                fs.writeFileSync(this.destinationPath('app/styles/theme/_bootswatch.scss'), body);
                this.log("Done.");
            } else {
                this.log("Connection error.");
            }
            incrementRequestsDone();
        }.bind(this));

        request(theme.scssVariables, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                this.log("Rewriting variables.scss");
                fs.writeFileSync(this.destinationPath('./app/styles/theme/_variables.scss'), body);
                this.log("Done.");
            } else {
                this.log("Connection error.");
            }
            incrementRequestsDone();
        }.bind(this));
    }
});
