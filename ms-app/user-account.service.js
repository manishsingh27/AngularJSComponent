(function () {
    'use strict';

    angular.module('msApp').factory('userAccountService', function ($http, apiBase) {
        var self = this;

        self.getUser = function (userName) {
            return $http.get(apiBase + 'user/' + encodeURIComponent(userName) + '/get')
                .then(function (result) {
                    return result.data;
                });
        }

        self.addUser = function (userModel) {
            return $http.post(apiBase + 'user/add', userModel)
                .then(function (result) {
                    return result.data;
                });
        }

        return this;
    });
})();
