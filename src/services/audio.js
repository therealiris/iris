// audio handler for native audio with fallback for html5 audio
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
import { NativeAudio } from '@ionic-native/native-audio';
import { Config } from '../app/config';
var AudioService = /** @class */ (function () {
    function AudioService(platform, nativeAudio) {
        var _this = this;
        this.platform = platform;
        this.nativeAudio = nativeAudio;
        this.ready = null;
        this.audio = [];
        this.volume = 1;
        this.ready = new Promise(function (resolve, reject) {
            // promise that only fires after all files have loaded
            platform.ready().then(function () {
                var files = ['login', 'message-received-back', 'message-received-front', 'message-sent', 'calling'];
                var c = 1;
                if (_this.platform.is('cordova')) {
                    files.forEach(function (file) {
                        _this.nativeAudio.preloadSimple(file, 'assets/audio/' + file + '.mp3').then(function (msg) {
                            c++;
                            if (c == files.length) {
                                setTimeout(resolve, 100);
                            }
                        }, function (msg) {
                            reject('failed to load audio');
                            console.debug('ERROR loading sound: ' + msg);
                        });
                    });
                }
                else {
                    files.forEach(function (file) {
                        _this.audio[file] = new Audio('assets/audio/' + file + '.mp3');
                        _this.audio[file].volume = _this.volume;
                    });
                    resolve();
                }
            });
        });
        this.ready.then(function () {
            console.debug('Audio initilized.');
        });
    }
    // play an audio clip
    AudioService.prototype.play = function (clip) {
        if (!Config.audio) {
            return;
        }
        if (this.platform.is('cordova')) {
            if (clip === "calling")
                this.nativeAudio.loop(clip);
            else
                this.nativeAudio.play(clip);
        }
        else if (this.audio[clip]) {
            this.audio[clip].play();
        }
    };
    AudioService.prototype.stopAudioCalling = function () {
        this.nativeAudio.stop('calling');
    };
    AudioService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Platform, NativeAudio])
    ], AudioService);
    return AudioService;
}());
export { AudioService };
//# sourceMappingURL=audio.js.map