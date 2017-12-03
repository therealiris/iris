// handle socket io connections
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
import { Config } from '../app/config';
import * as io from 'socket.io-client';
var SocketService = /** @class */ (function () {
    function SocketService() {
        this.socket = null;
        // connect to our server
        // change this url here
        this.socket = io.connect(Config.server);
    }
    // generate a unique custom request id
    SocketService.prototype.makeId = function (len) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$';
        for (var i = 0; i < (len || 10); i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
    // send an event and get a response back
    SocketService.prototype.promise = function (eventName, request) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var success = function (response) {
                console.debug(eventName + '|' + request.responseName + ': complete!');
                _this.socket.removeListener(request.responseName, success);
                resolve(response);
            };
            request.responseName = '$response$' + _this.makeId(10) + '$';
            console.debug(eventName + '|' + request.responseName + ': Sending socket promise...');
            _this.socket.on(request.responseName, success);
            _this.socket.emit(eventName, request);
        });
    };
    SocketService.prototype.emit = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.socket).emit.apply(_a, args);
        var _a;
        // @BUG
        //this.socket.emit(args[0], args[1]);
    };
    SocketService.prototype.on = function (name, data) {
        this.socket.on(name, data);
    };
    SocketService.prototype.removeListener = function (name, data) {
        this.socket.removeListener(name, data);
    };
    SocketService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], SocketService);
    return SocketService;
}());
export { SocketService };
//# sourceMappingURL=socket.js.map