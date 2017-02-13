(function() {
  'use strict';

  angular.module('appName')
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'modules/core/views/dashboard.html',
          controller: 'TestCtrl',
          controllerAs: 'vm'
        });
    }]);
})();
