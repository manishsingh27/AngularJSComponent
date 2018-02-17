(function () {
    'use strict';

    angular.module('msApp').component('courseDiscussion', {
        bindings: {
            course: '<',
            loggedIn: '<'
        },
        controllerAs: 'vm',
        controller: function (authenticationService, courseService) {
            var vm = this;

            vm.courseDiscussion = null;
            vm.authenticationService = authenticationService;
            vm.commentEntryVisible = false;

            vm.$onChanges = function (changes) {
                if ((changes.loggedIn != null && changes.loggedIn.currentValue != null) || 
                    (changes.course != null && changes.course.currentValue != null)) {
                    if (authenticationService.loggedIn && vm.course != null) {
                        courseService.getCourseDiscussion(vm.course.CourseId).then(function (courseDiscussion) {
                            vm.courseDiscussion = courseDiscussion;
                        });
                    }
                }
            }

            vm.showCommentEntry = function () {
                vm.commentEntryVisible = true;
            }

            vm.commentSubmitted = function (commentText) {
                if (authenticationService.loggedIn) {
                    courseService.addCourseDiscussionItem(authenticationService.userName, vm.course.CourseId, commentText).then(function (discussionItem) {
                        vm.courseDiscussion.push(discussionItem);
                        vm.commentEntryVisible = false;
                    });
                }
            }

            vm.commentCanceled = function () {
                vm.commentEntryVisible = false;
            }
        },
        templateUrl: 'ms-app/course/course-discussion.component.html'
    });
})();
