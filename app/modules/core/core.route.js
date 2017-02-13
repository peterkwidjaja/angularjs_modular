(function() {
  'use strict';

  angular.module('appName')
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('main', {
          url: '/',
          templateUrl: 'modules/core/main/main.html',
          controller: 'MainCtrl',
          controllerAs: 'mainVm'
        });
    }]);
})();
