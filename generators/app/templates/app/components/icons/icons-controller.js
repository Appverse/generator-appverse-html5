'use strict';

angular.module('App.Controllers')

.controller('IconsController',
    function ($log, $scope) {
        $log.debug('IconsController loading');

        /*MATERIAL ICONS*/
        var iconsState1 = [];
        var iconsState2 = ['apps',
        'radio_button_off',
        'keyboard_arrow_right',
        'alarm_add',
        'apple',
        'facebook',
        'login',
        'github-box',
        'linkedin',
        'assignment',
        'lock_open',
        'thumb_up'];
        $scope.icons = ['list',
        'radio_button_on',
        'keyboard_arrow_left',
        'alarm',
        'android',
        'twitter',
        'logout',
        'github-circle',
        'linkedin-box',
        'assignment_turned_in',
        'lock_outline',
        'thumb_down' ];
        Array.prototype.push.apply(iconsState1,$scope.icons);
        $scope.swapIconMorph = function(icon) {
          var index = iconsState1.indexOf(icon);
          if (index === -1){
              var index2 = iconsState2.indexOf(icon);
              $scope.icons[index2] = iconsState1[index2];
          } else {
              $scope.icons[index] = iconsState2[index];
          }
        }; 

        /*EO MATERIAL ICONS*/
    });
