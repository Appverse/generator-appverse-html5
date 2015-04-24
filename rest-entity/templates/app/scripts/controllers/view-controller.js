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
 * Controller <%=controllerName%> for <%=viewName%>.
 * Pay attention to injection of dependencies (factories, entities and Angular objects).
 */
angular.module('App.Controllers')

.controller('<%=controllerName%>',
    function ($scope, Restangular, $log) {
        $log.debug('<%=controllerName%>');
        $scope.base<%=_.capitalize(viewName)%> = Restangular.all('<%=viewName%>');
        $scope.<%=viewName%>=$scope.base<%=_.capitalize(viewName)%>.getList().$object;
        $scope.gridOptions = {
            data: '<%=viewName%>',
            columnDefs: [{
                field: 'id',
                displayName: 'Id',
                width: 40
                }, {
                field: 'name',
                displayName: 'Name'
                }, {
                displayName: '',
                cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text><button ng-click="editItem(row.entity)" class="btn btn-xs btn-primary glyphicon glyphicon-pencil"></button>&nbsp;<button ng-click="deleteItem(row.entity)" class="btn btn-xs btn-danger glyphicon glyphicon-trash"></button></span></div>',
                sortable: false,
                width: 70
                }],
            rowHeight: 34,
            filterOptions: {
                filterText: "",
                useExternalFilter: false
            },
            multiSelect: false
        };

        $scope.deleteItem = function (item) {
            item.remove().then(function () {
                var index = $scope.<%=viewName%>.indexOf(item);
                if (index > -1) {
                    $scope.<%=viewName%>.splice(index, 1);
                }
            });
        };

        $scope.editItem = function (item) {
            $scope.newItem = Restangular.copy(item);
        };

        $scope.cancel = function () {
            $scope.newItem = {};
            $scope.<%=viewName%>Form.$setPristine();
        };

        $scope.post = function (item) {
            if (item.id !== undefined) {
                item.put().then(function () {

                    $scope.<%=viewName%>.some(function (element, index) {
                        if (element.id === item.id) {
                            $scope.<%=viewName%>[index] = item;

                            var rowCache = $scope.gridOptions.ngGrid.rowCache[index]; //Refresh bug in ng-grid
                            rowCache.clone.entity = journal;
                            rowCache.entity = journal;

                            return true;
                        }
                    });
                });
            } else {
                $scope.base<%=_.capitalize(viewName)%>.post(item).then(function (responseData) {
                    $scope.<%=viewName%>.push(responseData);
                });
            }

            $scope.cancel();
        };

        $scope.filter<%=_.capitalize(viewName)%> = function () {
            $scope.gridOptions.filterOptions.filterText = 'Name:' + $scope.filterText;
        };
    });
