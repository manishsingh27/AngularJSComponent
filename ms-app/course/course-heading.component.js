(function () {
    'use strict';

    angular.module('msApp').component('courseHeading', {
        bindings: {
            course: '<'
        },
        controllerAs: 'vm',
        controller: function () {
            var vm = this;

        },
        templateUrl: 'ms-app/course/course-heading.component.html'
    });
})();
