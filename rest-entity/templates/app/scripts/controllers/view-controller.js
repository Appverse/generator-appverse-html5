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
 * Controller Currencies4Controller for Currencies4.
 * Pay attention to injection of dependencies (factories, entities and Angular objects).
 */
angular.module('App.Controllers')

.controller('<%=controllerName%>',
    function ($scope, Restangular, $log, $modal) {
        $log.debug('<%=controllerName%>');
        $scope.name = '<%=_.capitalize(viewName)%>';
        $scope.columns = [];
        $scope.<%=_.capitalize(viewName)%> = [];
        $scope.base<%=_.capitalize(viewName)%> = Restangular.all('<%=viewName%>');
        $scope.base<%=_.capitalize(viewName)%>.getList().then(function (items) {
            $scope.<%=_.capitalize(viewName)%> = items;
            for (var key in items[0].plain()) {
                $scope.columns.push({
                    field: key,
                    displayName: key,
                    resizable: true
                });
            }
            $scope.columns.push({
                displayName: '',
                cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text><button ng-click="editItem(row.entity)" class="btn btn-xs btn-primary glyphicon glyphicon-pencil"></button>&nbsp;<button ng-click="deleteItem(row.entity)" class="btn btn-xs btn-danger glyphicon glyphicon-trash"></button></span></div>',
                sortable: false,
                width: 100,
                minWidth: 100
            });
        });

        $scope.gridOptions = {
            data: '<%=viewName%>',
            columnDefs: 'columns',
            rowHeight: 34,
            filterOptions: {
                filterText: "",
                useExternalFilter: false
            },
            multiSelect: false
        };

        $scope.deleteItem = function (item) {
            var deleteUser = confirm('Are you sure you want to delete?');
             if (deleteUser) {
                 item.remove().then(function () {
                    var index = $scope.<%=_.capitalize(viewName)%> .indexOf(item);
                    if (index > -1) {
                        $scope.<%=_.capitalize(viewName)%> .splice(index, 1);
                    }
                });
             }
        };

        $scope.editItem = function (item) {
            $scope.newItem = Restangular.copy(item);
            $scope.open(item);
        };

        $scope.post = function (item) {
            if (item.id !== undefined) {
                item.put().then(function () {

                    $scope.<%=_.capitalize(viewName)%>.some(function (element, index) {
                        if (element.id === item.id) {
                            $scope.<%=_.capitalize(viewName)%>[index] = item;
                            var rowCache = $scope.gridOptions.ngGrid.rowCache[index]; //Refresh bug in ng-grid
                            rowCache.clone.entity = item;
                            rowCache.entity = item;
                            return true;
                        }
                    });
                });
            } else {
                $scope.base<%=_.capitalize(viewName)%>.post(item).then(function (responseData) {
                    $scope.<%=viewName%>.push(responseData);
                });
            }
        };

        $scope.filter<%=_.capitalize(viewName)%> = function () {
            $scope.gridOptions.filterOptions.filterText = $scope.filterText;
        };

        //MODAL FORM
        $scope.animationsEnabled = true;

        $scope.open = function (item) {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/<%=viewName%>/<%=viewName%>ModalForm.html',
                controller: '<%=viewName%>-modal-controller',
                resolve: {
                    item: function () {
                        return item;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                if (selectedItem) {
                    $scope.post(selectedItem);
                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };

    });
