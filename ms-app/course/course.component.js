(function () {
    'use strict';

    angular.module('msApp').component('course', {
        bindings: {
            courseId: '<'
        },
        controllerAs: 'vm',
        controller: function (courseService, authenticationService) {
            var vm = this;

            vm.course = null;
            vm.authenticationService = authenticationService;

            vm.$onInit = function () {
                if (vm.courseId) {
                    courseService.getCourse(vm.courseId).then(function (course) {
                        vm.course = course;
                        if (authenticationService.loggedIn) {
                            courseService.updateRecentlyViewedCourse(authenticationService.userName, vm.course.CourseId).then(function (recentItem) {
                            });
                        }
                    });
                }
            }
        },
        templateUrl: 'ms-app/course/course.component.html'
    });
})();
