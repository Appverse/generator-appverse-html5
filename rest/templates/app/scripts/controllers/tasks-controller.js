'use strict';

angular.module('App.Controllers')

.controller('tasksController', ['$log', '$scope',

    function ($log, $scope) {
        $log.debug('tasksController loading');

        $scope.addTask = function () {
            $scope.tasks.push({
                name: $scope.newTask,
                done: false
            });

            /* Using Restangular method */
            $scope.tasks.put();
        };
    }]);
