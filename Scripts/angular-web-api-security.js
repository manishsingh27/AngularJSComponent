(function () {
    'use strict';

    var securityModule = angular.module('securityModule', []);

    //securityModule.value('baseAddress', 'http://localhost:9838/');
    securityModule.value('baseAddress', 'http://pluralsightcourseviewer.azurewebsites.net/');

    securityModule.factory('authenticationService', function ($http, baseAddress) {

        var self = this;
        
        var apiAccountBase = baseAddress + 'api/Account/';

        self.userName = (localStorage['userName'] ? localStorage['userName'] : '');
        self.loggedIn = (localStorage['login'] && self.userName != '' ? true : false);

        self.register = function (registerModel) {
            return $http.post(apiAccountBase + 'Register', registerModel)
                .then(function (result) {
                    var userModel = {
                        UserName: registerModel.Email,
                        FirstName: registerModel.FirstName,
                        LastName: registerModel.LastName
                    };
                    return userModel;
                });
        }

        self.login = function (userName, password) {
            var payload = 'password=' + encodeURIComponent(password) 
                + '&grant_type=password&username=' + encodeURIComponent(userName);
            return $http({
                    url: baseAddress + 'Token',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    data: payload
                }).then(function (result) {
                    localStorage['login'] = JSON.stringify(result.data);
                    localStorage['userName'] = userName;
                    self.loggedIn = true;
                    self.userName = userName;
                    return userName;
                });
        }

        self.logout = function () {
            localStorage.removeItem('login');
            localStorage.removeItem('userName');
            self.loggedIn = false;
            self.userName = '';
        }

        self.getAccessToken = function () {
            var accessToken = '';
            var login = localStorage['login'];
            if (login)
                accessToken = JSON.parse(login).access_token;
            
            return accessToken;
        }

        return this;
    });

    securityModule.component('login', {
        bindings: {
            showRememberMe: '<',
            postLogin: '&'
        },
        controllerAs: 'vm',
        controller: function (authenticationService) {
            var vm = this;

            vm.$onInit = function () {
                if (!vm.showRememberMe)
                    vm.showRememberMe = false;
            }

            vm.credentials = {
                userName: '',
                password: '',
                rememberMe: false
            };

            vm.login = function () {
                authenticationService.login(vm.credentials.userName, vm.credentials.password).then(function (loginResponse) {
                    vm.postLogin()(loginResponse);
                });
            }
        },
        template: `
                <form class="form-horizontal">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3>Log In</h3>
                        </div>
                        <div class="panel-body">
                            <div class="form-group">
                                <label for="inputLogin" class="col-sm-3 control-label">Login</label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control" id="inputLogin" placeholder="User name" ng-model="vm.credentials.userName">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="inputPassword" class="col-sm-3 control-label">Password</label>
                                <div class="col-sm-9">
                                    <input type="password" class="form-control" id="inputPassword" placeholder="Password" ng-model="vm.credentials.password">
                                </div>
                            </div>
                            <div class="form-group" ng-if="vm.showRememberMe == true">
                                <div class="col-sm-offset-2 col-sm-10">
                                    <div class="checkbox">
                                        <label>
                                            <input type="checkbox" ng-model="vm.credentials.rememberMe"> Remember me
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="panel-footer" style="text-align: right">
                            <button type="button" class="btn btn-primary" ng-click="vm.login()">Login</button>
                        </div>
                    </div>
                </form>
                `
    });

    securityModule.component('userPanel', {
        bindings: {
            loginAfterRegister: '<',
            postRegister: '&',
            postLogin: '&',
            userLabel: '<',
            showLogout: '<'
        },
        controllerAs: 'vm',
        controller: function (authenticationService) {
            var vm = this;

            vm.authenticationService = authenticationService;
            vm.loginMode = 'login'; // login, register

            vm.logout = function () {
                authenticationService.logout();
            }
        },
        template: `
                <div ng-if="vm.authenticationService.getAccessToken() == ''">
                    <div class="dropdown">
                        <a id="login" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Log In
                            <span class="caret"></span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="login" style="width: 500px;">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <h4>
                                        <a href ng-click="vm.loginMode = 'register'; $event.stopPropagation();">Register</a>
                                        &nbsp;|&nbsp;
                                        <a href ng-click="vm.loginMode = 'login'; $event.stopPropagation();">Log In</a>
                                    </h4>
                                </div>
                                <div class="row" ng-show="vm.loginMode == 'register'">
                                    <div class="col-md-12">
                                        <register login-after-register="vm.loginAfterRegister"
                                                  post-register="vm.postRegister()"
                                                  post-login="vm.postLogin()"></register>
                                    </div>
                                </div>
                                <div class="row" ng-show="vm.loginMode == 'login'">
                                    <div class="col-md-12">
                                        <login post-login="vm.postLogin()"></login>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div ng-if="vm.authenticationService.getAccessToken() != ''">
                    <div>
                        <span>{{ vm.userLabel }}</span>
                        <span ng-if="vm.showLogout">
                            ( <a href ng-click="vm.logout()">Log Out</a> )
                        </span>
                    </div>
                </div>
                `
    });

    securityModule.component('register', {
        bindings: {
            loginAfterRegister: '<',
            postRegister: '&',
            postLogin: '&'
        },
        controllerAs: 'vm',
        controller: function (authenticationService) {
            var vm = this;

            vm.regInfo = {
                firstName: '',
                lastName: '',
                email: '',
                password: ''
            };
            
            vm.register = function () {
                var registerModel = {
                    FirstName: vm.regInfo.firstName,
                    LastName: vm.regInfo.lastName,
                    Email: vm.regInfo.email,
                    Password: vm.regInfo.password,
                    ConfirmPassword: vm.regInfo.password
                };
                authenticationService.register(registerModel).then(function (registerResponse) {
                    if (vm.postRegister)
                        vm.postRegister()(registerResponse, function () {
                            loginAfter();
                        });
                    else
                        loginAfter();
                });
            }

            var loginAfter = function () {
                if (vm.loginAfterRegister) {
                    authenticationService.login(vm.regInfo.email, vm.regInfo.password).then(function (loginResponse) {
                        if (vm.postLogin)
                            vm.postLogin()(loginResponse);
                    });
                }
            }
        },
        template: `
                <form class="form-horizontal">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3>Create a New Account</h3>
                        </div>
                        <div class="panel-body">
                            <div class="form-group">
                                <label for="inputFirstName" class="col-sm-3 control-label">First Name</label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control" id="inputFirstName" placeholder="First Name" ng-model="vm.regInfo.firstName">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="inputLastName" class="col-sm-3 control-label">Last Name</label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control" id="inputLastName" placeholder="Last Name" ng-model="vm.regInfo.lastName">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="inputLogin" class="col-sm-3 control-label">Email</label>
                                <div class="col-sm-9">
                                    <input type="email" class="form-control" id="inputLogin" placeholder="Email" ng-model="vm.regInfo.email">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="inputPassword" class="col-sm-3 control-label">Password</label>
                                <div class="col-sm-9">
                                    <input type="password" class="form-control" id="inputPassword" placeholder="Password" ng-model="vm.regInfo.password">
                                </div>
                            </div>
                        </div>
                        <div class="panel-footer" style="text-align: right">
                            <button type="button" class="btn btn-primary" ng-click="vm.register()">Register</button>
                        </div>
                    </div>
                </form>
                `
    });
})();
