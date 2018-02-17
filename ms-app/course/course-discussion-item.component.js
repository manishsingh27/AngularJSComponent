(function () {
    'use strict';
    
    angular.module('msApp').component('courseDiscussionItem', {
        bindings: {
            commentSubmitted: '&',
            commentCanceled: '&'
        },
        controllerAs: 'vm',
        controller: function () {
            var vm = this;

            vm.commentText = '';

            vm.submit = function () {
                if (vm.commentText != '') {
                    if (vm.commentSubmitted != null) {
                        vm.commentSubmitted()(vm.commentText);
                        vm.commentText = '';
                    }
                }
                else
                    vm.cancel();
            }

            vm.cancel = function () {
                if (vm.commentCanceled != null) {
                    vm.commentCanceled()();
                    vm.commentText = '';
                }
            }
        },
        templateUrl: 'ms-app/course/course-discussion-item.component.html'
    });       
})();