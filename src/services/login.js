// handle login and authenticaion for users
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Events, AlertController, App, Platform } from 'ionic-angular';
import { AudioService, SocketService, ContactService } from './';
import { NativeStorage } from 'ionic-native';
var LoginService = /** @class */ (function () {
    function LoginService(contactService, platform, app, audio, socket, events, alertCtrl) {
        var _this = this;
        this.contactService = contactService;
        this.platform = platform;
        this.audio = audio;
        this.socket = socket;
        this.events = events;
        this.alertCtrl = alertCtrl;
        this.user = null;
        this.storage = null;
        this.playLoginSound = false;
        this.complete = null;
        // define nativestorage to be backwards compatable with localStorage
        if (this.platform.is('cordova')) {
            this.storage = NativeStorage;
        }
        else {
            this.storage = {
                getItem: function (key) {
                    return new Promise(function (resolve, reject) {
                        var data = null;
                        try {
                            data = JSON.parse(localStorage.getItem(key));
                        }
                        catch (e) {
                        }
                        resolve(data);
                    });
                },
                setItem: function (key, value) { return new Promise(function (resolve, reject) { return resolve(localStorage.setItem(key, JSON.stringify(value))); }); },
                remove: function (key) { return new Promise(function (resolve, reject) { return resolve(localStorage.removeItem(key)); }); }
            };
        }
        this.complete = this.makeComplete();
        this.nav = app.getActiveNav();
        // authenticate using jwt once socket is connected
        this.socket.on('connect', function (socket) {
            _this.auth(false);
        });
        // unused
        this.socket.on('disconnect', function (socket) {
        });
        // triggered when the user logs in
        this.events.subscribe('user.login', function (data) {
            _this.user = data.user;
            console.log("here i am logging ", _this.user);
        });
    }
    // authenticate a user using jwt
    LoginService.prototype.auth = function (force) {
        var _this = this;
        var complete = function (token) {
            console.debug('REAL TOKEN', token);
            if (token) {
                token = token.token;
            }
            console.debug('token', token);
            if (!_this.user) {
                if (!token) {
                    _this.events.publish('auth', false);
                    return _this.go();
                }
            }
            var done = function () {
                _this.socket.removeListener('auth_error', error);
                // this.socket.removeListener('login_successful', success);
            };
            var error = function (message) {
                done();
                _this.storage.remove('token');
                _this.go();
                console.log('error auth.');
            };
            var success = function (user) {
                console.debug('Auth: ', user);
                done();
                _this.events.publish('user.login', {
                    user: user
                });
            };
            _this.socket.emit('auth', token);
            _this.socket.on('login_successful', success);
            _this.socket.on('auth_error', error);
        };
        this.storage.getItem('token').then(complete).catch(complete);
    };
    // go to the login page with no transitions
    LoginService.prototype.go = function () {
        // this.nav.setRoot(LoginPage, {}, {animate: false})
        //this.nav.push(LoginPage, {}, {animate: false, direction: 'forward'});
    };
    // perform a login from the log in page
    LoginService.prototype.login = function (user) {
        var _this = this;
        this.complete = this.makeComplete();
        return new Promise(function (resolve, reject) {
            var done = function () {
                _this.socket.removeListener('login_error', error);
                _this.socket.removeListener('login_successful', success);
            };
            var error = function (message) {
                var alert = _this.alertCtrl.create({
                    title: 'Error',
                    subTitle: message,
                    buttons: ['OK']
                });
                alert.present();
                done();
                //reject('login fail');
            };
            var success = function (user, token) {
                console.log('Login: ', user);
                if (token) {
                    _this.storage.setItem('token', { token: token });
                }
                done();
                _this.events.publish('user.login', {
                    user: user
                });
                resolve();
            };
            _this.socket.on('login_error', error);
            _this.socket.on('login_successful', success);
            _this.socket.emit('login', user);
        });
    };
    // log the user out
    LoginService.prototype.logout = function () {
        this.storage.remove('token');
        this.user = null;
        //$rootScope.contacts.length = 0;
        this.contactService.contacts.length = 0;
        this.events.publish('user.logout');
        this.go();
        this.socket.emit('logout', null);
        this.complete = this.makeComplete();
    };
    // a promise that fires once we have logged in
    // used by controllers
    LoginService.prototype.makeComplete = function () {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (self.user) {
                resolve(self.user);
                return;
            }
            var cleanA = self.events.subscribe('user.login', function (data) {
                //cleanA(); cleanB();
                resolve(data.user);
            });
            var cleanB = self.events.subscribe('auth', function () {
                //cleanA(); cleanB();
                //reject('auth fail');
            });
        });
    };
    ;
    LoginService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [ContactService, Platform, App, AudioService, SocketService, Events, AlertController])
    ], LoginService);
    return LoginService;
}());
export { LoginService };
//# sourceMappingURL=login.js.map