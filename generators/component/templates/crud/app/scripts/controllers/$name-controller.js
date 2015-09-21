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
  * Controller <%=name%>Controller
  * Pay attention to injection of dependencies (factories, entities and Angular objects).
  */
 angular.module('App.Controllers')

 .controller('<%=name%>Controller',
     function ($scope, Restangular, $log, $modal) {
         $log.debug('<%=name%>');
         $scope.name = '<%=lodash.capitalize(name)%>';
         $scope.columns = [];
         $scope.<%=lodash.capitalize(name)%> = [];
         $scope.base<%=lodash.capitalize(name)%> = Restangular.all('<%=name%>');
         $scope.base<%=lodash.capitalize(name)%>.getList().then(function (items) {
             $scope.<%=lodash.capitalize(name)%> = items;
             for (var key in items[0].plain()) {
                 $scope.columns.push({
                     field: key,
                     displayName: key,
                     resizable: true
                 });
             }
             $scope.columns.push({
                 displayName: '',
                cellTemplate: '<div class="ngCellText text-right" ng-class="col.colIndex()"><span ng-cell-text><button ng-click="editItem(row.entity)" class="btn btn-xs btn-primary glyphicon glyphicon-pencil"></button>&nbsp;<button ng-click="deleteItem(row.entity)" class="btn btn-xs btn-danger glyphicon glyphicon-trash"></button></span></div>',
                 sortable: false,
                 width: 150,
                 minWidth: 100
             });
         });

         $scope.gridOptions = {
             data: '<%=lodash.capitalize(name)%>',
             columnDefs: 'columns',
             rowHeight: 48,
             headerRowHeight:48,
             filterOptions: {
                 filterText: "",
                 useExternalFilter: false
             },
             multiSelect: false,
             showFooter: true,
             footerRowHeight: 48,
             footerTemplate: '<div class="ngTotalSelectContainer pull-right"><div class="ngFooterTotalItems" ng-class="{\'ngNoMultiSelect\': !multiSelect}" ><span class="ngLabel">{{i18n.ngTotalItemsLabel}} {{maxRows()}}</span><span ng-show="filterText.length > 0" class="ngLabel"> ({{i18n.ngShowingItemsLabel}} {{totalFilteredItemsLength()}})</span></div><div class="ngFooterSelectedItems" ng-show="multiSelect"><span class="ngLabel">{{i18n.ngSelectedItemsLabel}} {{selectedItems.length}}</span></div></div>'
         };


         $scope.deleteItem = function (item) {
             var deleteUser = confirm('Are you sure you want to delete?');
             if (deleteUser) {
                 item.remove().then(function () {
                     var index = $scope.<%=lodash.capitalize(name)%>.indexOf(item);
                     if (index > -1) {
                         $scope.<%=lodash.capitalize(name)%>.splice(index, 1);
                     }
                 });
             }
         };

         $scope.editItem = function (item) {
             $scope.newItem = Restangular.copy(item);
             $scope.open(item);
         };

         $scope.post = function (item, add) {
             if (!add) {
                 item.put().then(function () {

                     $scope.<%=lodash.capitalize(name)%>.some(function (element, index) {
                         if (element.id === item.id) {
                             $scope.<%=lodash.capitalize(name)%>[index] = item;
                             var rowCache = $scope.gridOptions.ngGrid.rowCache[index]; //Refresh bug in ng-grid
                             rowCache.clone.entity = item;
                             rowCache.entity = item;
                             return true;
                         }
                     });
                 });
             } else {
                 $scope.base<%=lodash.capitalize(name)%>.post(item).then(function (responseData) {
                     $scope.<%=lodash.capitalize(name)%>.push(responseData);
                 });
             }
         };

         $scope.filter<%=lodash.capitalize(name)%> = function () {
             $scope.gridOptions.filterOptions.filterText = $scope.filterText;
         };
         //MODAL FORM
         $scope.animationsEnabled = true;

         $scope.open = function (item) {
             var modalInstance = $modal.open({
                 animation: $scope.animationsEnabled,
                 templateUrl: 'views/<%=name%>/<%=name%>ModalForm.html',
                 controller: '<%=name%>-modal-controller',
                 scope: $scope,
                 resolve: {
                     item: function () {
                         return item;
                     }
                 }
             });
         };

        $scope.modalClose = function(item,add){
             if (item) {
                 $scope.post(item,add);
             }
         };

         $scope.toggleAnimation = function () {
             $scope.animationsEnabled = !$scope.animationsEnabled;
         };

     });
