'use strict';
var yeoman = require('yeoman-generator');
var gen = require('../generator-base');
var _ = require('lodash');
var request = require('request');


module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.conflicter.force = true;
        if (!this.options['skip-welcome-message']) {
            this.welcome();
            this.checkVersion();
        }
        if (!this.options['provider']) {
            this.provider = 'http://appverse.gftlabs.com/theme';
        } else {
            this.provider = this.options['provider'];
        }
        var prompts = [];
        this.themeprompts = [];
        this.remotethemes = {};
        this.bootstrapTheme = false;

        if (this.options['skip-prompts']) {
            this.skipprompts = true;
        } else {
            this.skipprompts = false;
        }

        if (!_.isUndefined(this.options['jsonproject'])) {
            this.bootstrapTheme = this.options['jsonproject'].theme.enabled;
            this.skipprompts = false;
            if (this.bootstrapTheme) {
                this.theme = {};
                this.theme.scss = this.options['config'].theme.config.scss;
                this.theme.scssVariables = this.options['config'].theme.config.scssVariables;
            }
        }

        if (!this.options['skip-prompts']) {
            prompts = {
                type: 'list',
                name: 'themes',
                message: "Select theme:",
                choices: []
            };
            var done = this.async();
            this.info(" Getting themes from " + this.provider);
            request(this.provider, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    this.remotethemes = JSON.parse(body.toString());
                    this.remotethemes.themes.forEach(function (entry) {
                        var option = entry.name;
                        prompts.choices.push(option);
                    }.bind(this));
                    this.themeprompts.push(prompts);
                    done();
                } else {
                    this.log("Connection error." + error);
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
            if (!this.skipprompts) {
                this.theme = search(this.selectedTheme, this.remotethemes.themes);
            }
        },
        theme: function () {
            if (!this.skipprompts || this.bootstrapTheme) {
                var done = this.async();
                request(this.theme.scss, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        this.log("Rewriting _theme.scss");
                        this.fs.write(this.destinationPath('app/styles/theme/_theme.scss'), body);
                    } else {
                        this.log("Connection error.");
                    }
                    done();
                }.bind(this));
            }
        },
        variables: function () {
            if (!this.skipprompts || this.bootstrapTheme) {
                var done = this.async();
                request(this.theme.scssVariables, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        this.log("Rewriting variables.scss");
                        this.fs.write(this.destinationPath('./app/styles/theme/_variables.scss'), body);
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
