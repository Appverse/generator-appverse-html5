'use strict';
var yeoman = require('yeoman-generator');
var request = require('request');
var utils = require('../utils.js');
var fs = require('fs');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
        utils.checkVersion.call(this);

    },
    initializing: function () {
        this.conflicter.force = true;

        this.themeprompts = [];
        this.remotethemes = {};
        var prompts = {
            type: 'list',
            name: 'themes',
            message: "Select bootswatch theme:",
            choices: []
        };
        var done = this.async();
        this.log(" Getting themes from http://bootswatch.com ");
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
    writing: {
        prepare: function () {
            function search(nameKey, myArray) {
                for (var i = 0; i < myArray.length; i++) {
                    if (myArray[i].name === nameKey) {
                        return myArray[i];
                    }
                }
            }
            if (this.interactiveMode) {
                this.theme = search(this.selectedTheme, this.remotethemes.themes);
            } else {
                this.theme = this.theme.name;
            }
        },
        theme: function () {
            var done = this.async();
            request(this.theme.scss, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    this.log("Rewriting bootswatch.scss");
                    fs.writeFileSync(this.destinationPath('app/styles/theme/_bootswatch.scss'), body);
                } else {
                    this.log("Bootswatch Connection error.");
                }
                done();
            }.bind(this));
        },
        variables: function () {
            var done = this.async();
            request(this.theme.scssVariables, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    this.log("Rewriting variables.scss");
                    fs.writeFileSync(this.destinationPath('./app/styles/theme/_variables.scss'), body);
                } else {
                    this.log("Bootswatch Connection error.");
                }
                done();
            }.bind(this));
        }
    },
    end: function () {
        this.log("Finish.");
    }
});
