(function () {
    'use strict';

    angular.module('msApp').component('authorHeading', {
        bindings: {
            author: '<'
        },
        controllerAs: 'vm',
        controller: function () {
            var vm = this;

        },
        templateUrl: 'ms-app/author/author-heading.component.html'
    });
})();
