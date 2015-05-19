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
var fs = require('fs');
var ZSchema = require('z-schema');
var path = require('path');

//Read JSON from file or URL
var readJSONFileOrUrl = function (url, callback) {
    if (/^https?:/.test(url)) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                callback(null, JSON.parse(body.toString()));
            } else {
                callback(error, null);
            }
        });
    }
    if (!fs.existsSync(url)) {
        callback("Wrong Path. I can't find a JSON file there!", null);
    }

    callback(null, JSON.parse(fs.readFileSync(url, 'utf8')));
};

//Validate JSON against schema
var validateJson = function (json, tpath, callback) {
    var validator = new ZSchema();
    this.schema = JSON.parse(fs.readFileSync(path.join(tpath, '../schema/appverse-project-schema.json'), 'utf-8'));
    var valid = validator.validate(json, this.schema);
    if (!valid) {
        callback("Sorry. Not a valid JSON project! ", null);
        callback("Check the project-schema.json for a valid JSON file. \n", null);
        callback(JSON.stringify(this.schema), null);
    }
    callback(null, true);
};

module.exports = {
    readJSONFileOrUrl: readJSONFileOrUrl,
    validateJson: validateJson
};
