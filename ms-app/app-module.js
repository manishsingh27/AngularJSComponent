(function () {
    'use strict';

    var appModule = angular.module('msApp', ['securityModule', 'ui.router']);

    appModule.value('apiBase', 'http://localhost:9838/api/courseviewer/');
    appModule.value('componentBorders', true);

    appModule.run(function (componentBorders) {
        if (componentBorders) {
            if (appModule._invokeQueue) {
                appModule._invokeQueue.forEach(function (item) {
                    if (item[1] == 'component') {
                        var componentName = item[2][0];
                        var componentProperties = item[2][1];
                        if (componentProperties.templateUrl) {
                            var templateUrl = componentProperties.templateUrl;
                            delete componentProperties.templateUrl;
                            componentProperties.template = '<div class="component-borders"><b>' + componentName + '</b><div ng-include="\'' + templateUrl + '\'"></div></div>';
                        }
                        else {
                            var template = '<div class="component-borders">' + componentName + '<div>' + componentProperties.template + '</div></div>';
                            componentProperties.template = template;
                        }
                    }
                });
            }
        }
    });

    appModule.config(function ($stateProvider, $urlRouterProvider) {
        var states = [
            {
                name: 'home',
                url: '',
                template: '<home></home>'
            },
            {
                name: 'home2',
                url: '/',
                template: '<home></home>'
            },        {
                name: 'courses',
                url: '/courses',
                template: '<course-list></course-list>'
            },
            {
                name: 'authors',
                url: '/authors',
                template: '<author-list></author-list>'
            },
            {
                name: 'author',
                url: '/author/{authorId}',
                resolve: {
                    authorId: function ($stateParams) {
                        return $stateParams.authorId;
                    }
                },
                template: '<author author-id="$resolve.authorId"></author>'
            },
            {
                name: 'author.bio',
                url: '/bio',
                template: '<author-bio author="vm.author"></author-bio>'
            },
            {
                name: 'author.courses',
                url: '/courses',
                template: '<author-courses author="vm.author"></author-courses>'
            },
            {
                name: 'course',
                url: '/course/{courseId}',
                resolve: {
                    courseId: function ($stateParams) {
                        return $stateParams.courseId;
                    }
                },
                template: '<course course-id="$resolve.courseId"></course>'
            },
            {
                name: 'course.modules',
                url: '/modules',
                template: '<course-modules course="vm.course"></course-modules>'
            },
            {
                name: 'course.description',
                url: '/description',
                template: '<course-description course="vm.course"></course-description>'
            },
            {
                name: 'course.discussion',
                url: '/discussion',
                template: '<course-discussion course="vm.course" logged-in="vm.authenticationService.loggedIn"></course-discussion>'
            }
        ];

        $urlRouterProvider.when('/author/:authorId', '/author/:authorId/courses');
        $urlRouterProvider.when('/course/:courseId', '/course/:courseId/modules');
        $urlRouterProvider.otherwise('/');

        states.forEach(function (state) {       
            $stateProvider.state(state);
        });
    });
})();
