'use strict';

angular.module('App.Controllers')

.controller('ModalController',
    function ($scope, $uibModalInstance, items) {

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function () {
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
