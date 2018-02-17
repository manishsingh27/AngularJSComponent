(function () {
    'use strict';
    
    angular.module('msApp').component('courseDiscussionList', {
        bindings: {
            courseDiscussion: '<',
        },
        controllerAs: 'vm',
        controller: function () {
            var vm = this;

        },
        templateUrl: 'ms-app/course/course-discussion-list.component.html'
    });    
})();