(function () {
    'use strict';

    angular.module('msApp').component('courseAuthorInfo', {
        bindings: {
            author: '<'
        },
        require: {
            courseVm: '^course' // course controller
        },
        controllerAs: 'vm',
        controller: function (courseService) {
            var vm = this;

            vm.courses = null;
            vm.courseLength = '';
            vm.courseReleased = '';

            vm.$onChanges = function (changes) {
                if (vm.courseVm != null && vm.courseVm.course != null) {
                    var course = vm.courseVm.course;
                    var hours = 0;
                    var minutes = 0;
                    var seconds = 0;
                    course.Modules.forEach(function (module) {
                        minutes += module.Minutes;
                        seconds += module.Seconds;
                    });
                    vm.courseLength = courseService.timeFormat(hours, minutes, seconds);
                    vm.courseReleased = new Date(course.Released).toLocaleDateString();
                }
            }
        },
        templateUrl: 'ms-app/course/course-author-info.component.html'
    });
})();
