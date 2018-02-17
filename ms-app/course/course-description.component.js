(function () {
    'use strict';

    angular.module('msApp').component('courseDescription', {
        bindings: {
            course: '<'
        },
        controllerAs: 'vm',
        controller: function () {
            var vm = this;

        },
        templateUrl: 'ms-app/course/course-description.component.html'
    });
})();
