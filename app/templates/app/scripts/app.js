'use strict';

angular.module('App.Controllers',[]);

angular.module('<%=appName%>App', ['COMMONAPI','App.Controllers'])

.run(['$rootScope', '$location', '$log', 'AuthenticationService', 'RoleService', 'AUTHORIZATION_DATA', 'SECURITY_GENERAL',
    function ($rootScope, $location, $log, AuthenticationService, RoleService, AUTHORIZATION_DATA, SECURITY_GENERAL) {

        /**
         * @function
         * @param {type} destinationRoute the path to be checked
         * @returns {Boolean}
         * @description To know if the passed route path is accessible without authentication.
         */
        function routeClean(destinationRoute) {
            if (AUTHORIZATION_DATA.routesThatDontRequireAuth.indexOf(destinationRoute) === -1) {
                return false;
            } else {
                return true;
            }
        }
        /**
         * @function
         * @param {type} destinationRoute the path to be checked
         * @returns {Boolean}
         * @description To know if the passed route path needs a a given role.
         */
        function routeAdmin(destinationRoute) {
            if (AUTHORIZATION_DATA.routesThatRequireAdmin.indexOf(destinationRoute) === -1) {
                return false;
            } else {
                return true;
            }
        }


        /**
         * @function
         * @requires $stateChangeStart
         * @param {stri} ev Navigation event
         * @param {type} to Destination State
         * @param {type} toParams Destination State params
         * @param {type} from Origin State
         * @param {type} fromParams Origin State params
         * @description
         *  Listen to $stateChangeStart event (All these events are fired at the $rootScope level).
         *  They key is adding this new function that watches the $stateChangeStart
         *  event and reacts on it. Once this event fires, we check if the route is
         *  clean.
         *  Information: https://github.com/angular-ui/ui-router/wiki
         */
        $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
            if (SECURITY_GENERAL.securityEnabled) {
                $log.debug('to: ' + to);
                // if route requires auth and user is not logged in
                if (routeClean(to.url) == false) {
                    if (AuthenticationService.isLoggedIn() == true) {
                        if (RoleService.validateRoleAdmin() == false) {
                            alert("YOU DO NOT HAVE THE NEEDED ROLE.");
                            ev.preventDefault();
                            //$location.path('/error');
                        }
                    } else {
                        $log.debug('ROUTE NOT CLEAN AND USER NOT LOGGED');
                        $log.debug('User is not logged and is rediercted to main page (REDIRECTION!!!!!!!!)');
                        //Use event.preventDefault() to prevent the transition from happening.
                        ev.preventDefault();
                        // Redirects back to main page
                        $location.path('/home');
                    }
                }
            }
        });
    }])

/**
 * @description
 * Intercepts 401 status response
 */
.config(['$httpProvider',
    function ($httpProvider) {

        var logsOutUserOn401 = ['$q', '$location',
            function ($q, $location) {
                var success = function (response) {
                    return response;
                };

                var error = function (response) {
                    if (response.status === 401) {
                        //Redirects them back to main/login page
                        $location.path('/home');

                        return $q.reject(response);
                    } else {
                        return $q.reject(response);
                    }
                };

                return function (promise) {
                    return promise.then(success, error);
                };
            }];

        $httpProvider.responseInterceptors.push(logsOutUserOn401);
    }]);
