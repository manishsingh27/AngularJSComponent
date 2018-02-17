(function () {
    'use strict';
    
    angular.module('msApp').factory('courseService', function (apiBase, $http, authenticationService) {

        var self = this;

        self.getAllCourses = function () {
            return $http.get(apiBase + 'courses')
                .then(function (result) {
                    return result.data;
                });
        }

        self.getCourse = function (courseId) {
            return $http.get(apiBase + 'course/' + courseId + '/full')
                .then(function (result) {
                    return result.data;
                });
        }

        self.timeFormat = function (hours, minutes, seconds) {
            while (seconds > 59) {
                minutes++;
                seconds -= 60;
            }
            while (minutes > 59) {
                hours++;
                minutes -= 60;
            }
                
            var timeString = '';

            if (hours > 0)
                timeString += hours.toString() + 'h ';
            timeString += minutes.toString() + 'm ';
            timeString += seconds.toString() + 's';

            return timeString;
        }

        self.getCourseDiscussion = function (courseId) {
            var accessToken = authenticationService.getAccessToken();
            return $http( {
                url: apiBase + 'course/' + courseId + '/discussion',
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + accessToken }
            })
            .then(function (result) {
                return result.data;
            });
        }

        self.addCourseDiscussionItem = function (userName, courseId, comment) {
            var accessToken = authenticationService.getAccessToken();
            if (accessToken != '') {
                var discussionItemModel = {
                    UserName: userName,
                    CourseId: courseId,
                    Comment: comment
                };
                return $http({
                    url: apiBase + 'course/' + courseId + '/discussion',
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + accessToken },
                    data: discussionItemModel
                })
                .then(function (result) {
                    return result.data;
                });
            }
        }
        
        self.updateRecentlyViewedCourse = function (userName, courseId) {
            var accessToken = authenticationService.getAccessToken();
            if (accessToken != '') {
                var recentModel = {
                    UserName: userName,
                    CourseId: courseId
                };
                return $http({
                    url: apiBase + 'courses/recent',
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + accessToken },
                    data: recentModel
                })
                .then(function (result) {

                });
            }
        }

        self.getRecentlyViewedCourses = function (userName) {
            var accessToken = authenticationService.getAccessToken();
            if (accessToken != '') {
                return $http({
                    url: apiBase + 'courses/recent/' + userName + '/get',
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + accessToken }
                })
                .then(function (result) {
                    return result.data;
                });
            }
        }

        self.clearRecentlyViewedList = function (userName) {
            var accessToken = authenticationService.getAccessToken();
            if (accessToken != '') {
                return $http({
                    url: apiBase + 'courses/recent/' + userName + '/clear',
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + accessToken }
                })
                .then(function (result) {

                });
            }
        }
        
        return this;
    });
})();