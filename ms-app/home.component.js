(function () {
    'use strict';

    angular.module('msApp').component('home', {
        controllerAs: 'vm',
        controller: function (authenticationService) {
            var vm = this;

            vm.authenticationService = authenticationService;
        },
        templateUrl: 'ms-app/home.component.html'
    });
})();
