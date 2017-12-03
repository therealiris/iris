// manages video elements
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
import { Platform } from 'ionic-angular';
var VideoService = /** @class */ (function () {
    function VideoService(platform) {
        this.platform = platform;
        this.localStream = null;
        this.facing = 'front';
        navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
    }
    VideoService.prototype.connect = function (audio, video, facing) {
        var _this = this;
        var self = this;
        console.debug('getting stream', audio, video);
        return new Promise(function (resolve, reject) {
            var connect = function () {
                var videoOptions = {
                    deviceId: null
                };
                if (_this.platform.is('cordova') && _this.platform.is('ios')) {
                    if (facing == 'front') {
                        videoOptions.deviceId = 'com.apple.avfoundation.avcapturedevice.built-in_video:1';
                    }
                    else if (facing == 'back') {
                        videoOptions.deviceId = 'com.apple.avfoundation.avcapturedevice.built-in_video:0';
                    }
                }
                navigator.getUserMedia({
                    audio: audio ? true : false,
                    video: video ? videoOptions : false
                }, function (stream) {
                    console.log('got local MediaStream: ', stream, stream.getTracks());
                    _this.localStream = stream;
                    resolve(stream);
                }, function (error) {
                    console.error('getUserMedia failed: ', error);
                    reject();
                });
            };
            var getDevices = function () {
                navigator.mediaDevices.enumerateDevices().then(function (data) {
                });
            };
            if (_this.localStream) {
                self.disconnect().then(connect);
            }
            else {
                connect();
            }
        });
    };
    // get a list of devices
    VideoService.prototype.devices = function () {
        return new Promise(function (resolve, reject) {
            navigator.mediaDevices.enumerateDevices().then(function (devices) {
                resolve(devices);
            });
        });
    };
    // mute audio
    // @todo: make this reestablish a connection
    VideoService.prototype.mute = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.localStream) {
                var tracks = _this.localStream.getAudioTracks();
                for (var x in tracks) {
                    tracks[x].enabled = false;
                }
            }
            resolve(_this.localStream);
        });
    };
    // unmute audio
    // @todo: make this reestablish a connection
    VideoService.prototype.unmute = function () {
        var _this = this;
        var self = this;
        return new Promise(function (resolve, reject) {
            self.connect(true, true, _this.facing).then(function (stream) {
                resolve(stream);
            });
        });
    };
    // disconnect the media stream
    VideoService.prototype.disconnect = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.localStream) {
                var tracks = _this.localStream.getTracks();
                for (var x in tracks) {
                    tracks[x].stop();
                }
                console.debug('stoping stream', _this.localStream.getTracks());
                _this.localStream = null;
            }
            resolve();
        });
    };
    VideoService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Platform])
    ], VideoService);
    return VideoService;
}());
export { VideoService };
//# sourceMappingURL=video.js.map