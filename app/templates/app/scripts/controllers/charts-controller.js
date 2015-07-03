/*
 Copyright (c) 2015 GFT Appverse, S.L., Sociedad Unipersonal.
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

/*
 * Controller ChartsController for Charts.
 * Pay attention to injection of dependencies (factories, entities and Angular objects).
 */
angular.module('App.Controllers')

.controller('ChartsController', ['$scope', '$interval',
        function ($scope, $interval) {
        $scope.name = 'Charts';
        //Lines
        $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.series = ['Series A', 'Series B'];
        $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
        //Doughnut
        $scope.doughnutData = [300, 500, 100];
        $scope.doughnutLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];

        //Radar
        $scope.radarLabels = ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"];
        $scope.radarData = [
    [65, 59, 90, 81, 56, 55, 40],
    [28, 48, 40, 19, 96, 27, 100]];

        //Pie
        $scope.pieLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        $scope.pieData = [300, 500, 100];

        //Polar Area Charts
        $scope.polarLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
        $scope.polarData = [300, 500, 100, 40, 120];

        //Dynamic
        $scope.dynLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
        $scope.dynData = [300, 500, 100, 40, 120];
        $scope.dynType = 'PolarArea';

        $scope.dynToggle = function () {
            $scope.dynType = $scope.dynType === 'PolarArea' ? 'Pie' : 'PolarArea';
        };

        $interval(function () {
            $scope.dynToggle();
        }, 10000);

        //Reactive
        $scope.reactLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
        $scope.reactData = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];
        $scope.reactColours = [
            { // grey
                fillColor: 'rgba(148,159,177,0.2)',
                strokeColor: 'rgba(148,159,177,1)',
                pointColor: 'rgba(148,159,177,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(148,159,177,0.8)'
      },
            { // dark grey
                fillColor: 'rgba(77,83,96,0.2)',
                strokeColor: 'rgba(77,83,96,1)',
                pointColor: 'rgba(77,83,96,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(77,83,96,1)'
      }
    ];
        $scope.randomize = function () {
            $scope.reactData = $scope.reactData.map(function (data) {
                return data.map(function (y) {
                    y = y + Math.random() * 10 - 5;
                    return parseInt(y < 0 ? 0 : y > 100 ? 100 : y);
                });
            });
        };

        $interval(function () {
            $scope.randomize();
        }, 5000);


        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };
        }

]);
