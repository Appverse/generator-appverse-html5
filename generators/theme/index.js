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
var appverseHtml5Gen = require('../generator-base');
var _ = require('lodash');
var request = require('request');
var pkg = require("../../package.json");


module.exports = appverseHtml5Gen.extend({
    initializing: function() {
        this.conflicter.force = true;
        if (!this.options['skip-welcome-message']) {
            this.welcome(pkg);
            this.checkVersion();
        }
        if (!this.options['provider']) {
            this.provider = 'https://bootswatch.com/api/3.json';
        } else {
            this.provider = this.options['provider'];
        }
       
        this.themeprompts = [];
        this.remotethemes = {};
        this.bootstrapTheme = false;
        this.remote = false;

        if (this.options['skip-prompts']) {
            this.skipprompts = true;
        } else {
            this.skipprompts = false;
        } 
         var done = this.async();
         this.bthemes = [];
         this.info(" Getting themes from " + this.provider);
         request(this.provider, function(error, response, body) {
           if (!error && response.statusCode === 200) {
           this.remotethemes = JSON.parse(body.toString());
           this.remotethemes.themes.forEach(function(entry) {
                var option = { name: entry.name, value: entry.name};           
                this.bthemes.push(option);
           }.bind(this));              
           done();
          } else {
             this.log("Connection error." + error);
          }
         }.bind(this));  
         if (!this.options['skip-prompts']) {
            this.themeprompts = {
                type: 'list',
                name: 'themes',
                message: "Select theme:",
                choices: [
                     {name: 'appverse', value: 'appvese'}, 
                     {name: 'appverse-dark', value: 'appverse-dark'}, 
                     {name: 'bootswatch', value: 'bootswatch'}
                     ], 
                default: 0
            }          
        } else {
            this.themeprompts = {};
        }
    },    
    prompting:  {
        theme : function () {
        var done = this.async();
        this.prompt(this.themeprompts, function(props) { 
            this.remote = false;
            this.selectedTheme = props.themes;  
            done();
        }.bind(this));
        },
        bootswatch: function () {
          if ( this.selectedTheme === 'bootswatch') {
            var done = this.async();
            this.prompt ({       
             type: "list",
             name: "bthemes",
             message: "Select Bootswatch theme:",
             choices: this.bthemes
            }, function (props) { 
                 this.remote = true;
                 this.selectedTheme = props.bthemes; 
                 this.info ('Selected: ' + this.selectedTheme);                
                 done();             
            }.bind(this));
          }                   
        }   
    },
    writing: {     
        prepare: function() {
            if (this.remote) {
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
            }
        },
        theme: function() {          
          if (this.remote) {
               var done = this.async();
                request(this.theme.scss, function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                        this.log("Rewriting _theme.scss");
                        this.fs.write(this.destinationPath('app/styles/sass/_theme.scss'), body);
                    } else {
                        this.log("Connection error.");
                    }
                    done();
                }.bind(this)); 
            }    
        },
        variables: function() {          
           if(this.remote) {
               var done = this.async();
               request(this.theme.scssVariables, function(error, response, body) {
                  if (!error && response.statusCode === 200) {
                     this.log("Rewriting variables.scss");
                     this.fs.write(this.destinationPath('app/styles/sass/_variables.scss'), body);
                  } else {
                       this.log("Connection error.");
                  }
                done();
              }.bind(this));
            } else {  
              this.fs.copyTpl (this.templatePath('config/sass.js'), 
                        this.destinationPath('config/sass.js'), 
                        this); 
            }
        }                   
    }, 
    end: function() {
        this.log("Finish.");
    }
});
