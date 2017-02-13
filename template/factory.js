(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name app.service:manpowerService
   * @description
   * # manpowerService
   * Service of the app
   */

    angular
    .module('appName')
    .factory('SampleService', SampleService);
    // Inject your dependencies as .$inject = ['$http', 'someSevide'];
    // function Name ($http, someSevide) {...}

    SampleService.$inject = ['$http'];

    function SampleService ($http) {

    }

})();
