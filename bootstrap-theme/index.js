'use strict';
var yeoman = require('yeoman-generator');
var request = require('request');
var utils = require('../lib');
var fs = require('fs');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
        utils.projectutils.checkVersion.call(this);
        //CONFIG
        this.option('interactiveMode');
        this.option('config');
        if (!_.isUndefined(this.options['interactiveMode'])) {
            this.interactiveMode = this.options['interactiveMode'];
        } else {
            this.interactiveMode = true;
        }
        if (!_.isUndefined(this.options['config'])) {
            this.bootstrapTheme = this.options['config'].theme.enabled;
            this.interactiveMode = false;
            if (this.bootstrapTheme) {
                this.theme = {};
                this.theme.scss = this.options['config'].theme.config.scss;
                this.theme.scssVariables = this.options['config'].theme.config.scssVariables;
            }
        }
    },
    initializing: function () {
        this.conflicter.force = true;
        this.themeprompts = [];
        this.remotethemes = {};
        var prompts = [];
        if (this.interactiveMode == true) {
            prompts = {
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
                    }.bind(this));
                    this.themeprompts.push(prompts);
                    done();
                } else {
                    this.log("Connection error.");
                }
            }.bind(this));
        } else {
            prompts = {};
        }
    },
    prompting: function () {
        var done = this.async();
        this.prompt(this.themeprompts, function (props) {
            if (this.themeprompts.length > 0) {
                this.selectedTheme = props.themes;
            }
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
            if (this.interactiveMode == true) {
                this.theme = search(this.selectedTheme, this.remotethemes.themes);
            }
        },
        theme: function () {
            if (this.interactiveMode == true || this.bootstrapTheme == true) {
                var done = this.async();
                request(this.theme.scss, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        this.log("Rewriting _theme.scss");
                        fs.writeFileSync(this.destinationPath('app/styles/theme/_theme.scss'), body);
                    } else {
                        this.log("Connection error.");
                    }
                    done();
                }.bind(this));
            }
        },
        variables: function () {
            if (this.interactiveMode == true || this.bootstrapTheme == true) {
                var done = this.async();
                request(this.theme.scssVariables, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        this.log("Rewriting variables.scss");
                        fs.writeFileSync(this.destinationPath('./app/styles/theme/_variables.scss'), body);
                    } else {
                        this.log("Connection error.");
                    }
                    done();
                }.bind(this));
            }
        }
    },
    end: function () {
        this.log("Finish.");
    }
});
