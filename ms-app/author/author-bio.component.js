(function () {
    'use strict';

    angular.module('msApp').component('authorBio', {
        bindings: {
            author: '<'
        },
        controllerAs: 'vm',
        controller: function () {
            var vm = this;

        },
        templateUrl: 'ms-app/author/author-bio.component.html'
    });
})();
