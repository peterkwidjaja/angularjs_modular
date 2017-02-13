(function () {
  'use strict';

  /**
  * @ngdoc function
  * @name app.directive:navbarDirective
  * @description
  * # navbarDirective
  * Directive of the app
  */

  angular
    .module('appName')
    .directive('navBar', navBar);

  function navBar() {

    var directive = {
      link: link,
      restrict: 'EA',
      scope: {
        menus: '=',
        brand: '='
      },
      controller: control,
      templateUrl: ''

    };

    return directive;

    function link(scope, element, attrs, $location) {

    }

    function control($scope, $location) {

    }

  }

})();
