(function () {
    'use strict';
    
    angular.module('msApp').factory('authorService', function (apiBase, $http) {

        var self = this;

        self.getAllAuthors = function () {
            return $http.get(apiBase + 'authors')
                .then(function (result) {
                    return result.data;
                });
        }

        self.getAuthor = function (authorId) {
            return $http.get(apiBase + 'author/' + authorId)
                .then(function (result) {
                    return result.data;
                });
        }

        self.getCourses = function (authorId) {
            return $http.get(apiBase + 'author/' + authorId + '/courses')
                .then(function (result) { 
                    return result.data;
            });
        }

        return this;
    });
})();