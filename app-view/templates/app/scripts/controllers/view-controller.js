'use strict';

/*
 * Controller <%=controllerName%> for <%=viewName%>.
 * Pay attention to injection of dependencies (factories, entities and Angular objects).
 */
angular.module('App.Controllers')

.controller('<%=controllerName%>', ['$scope',
        function ($scope) {
            $scope.name = '<%=viewName%>';
        }
]);
