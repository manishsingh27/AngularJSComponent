(function () {
    'use strict';

    angular.module('msApp').component('userStatus', {
        controllerAs: 'vm',
        controller: function (userAccountService, authenticationService) {
            var vm = this;

            vm.$onInit = function () {
                if (authenticationService.loggedIn) {
                    getUser(authenticationService.userName);
                }
            }
            
            vm.postRegister = function (registerResponse, callback) {
                userAccountService.addUser(registerResponse).then(function (user) {
                    if (callback != null)
                        callback();
                })
            }

            vm.postLogin = function (loginResponse) {
                getUser(loginResponse);
            }

            var getUser = function (userName) {
                userAccountService.getUser(userName).then(function (user) {
                    vm.userFullName = user.FirstName + ' ' + user.LastName;
                });
            }
        },
        templateUrl: 'ms-app/user-status.component.html'
    });
})();
