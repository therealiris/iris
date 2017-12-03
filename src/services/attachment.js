// handle s3 uploads
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
import { Platform, Events } from 'ionic-angular';
import { SocketService } from '../services';
import { Http } from '@angular/http';
var AttachmentService = /** @class */ (function () {
    function AttachmentService(platform, socket, http, events) {
        this.platform = platform;
        this.socket = socket;
        this.http = http;
        this.events = events;
    }
    AttachmentService.prototype.upload = function (up) {
        //var fileReader = new FileReader();
        //fileReader.readAsDataURL(file);
        var _this = this;
        // if its a video, we need to make a thumbnail
        /*
        if (file.indexOf('video') > -1) {
            let fileReader = new FileReader();
            fileReader.onload = () => {
                let blob = new Blob([fileReader.result], {type: file.type});
                let url = URL.createObjectURL(blob);
                let video = document.createElement('video');
                let timeupdate = () => {
                    if (snapImage()) {
                        video.removeEventListener('timeupdate', timeupdate);
                        video.pause();
                    }
                };
                video.addEventListener('loadeddata', () => {
                    if (snapImage()) {
                        video.removeEventListener('timeupdate', timeupdate);
                    }
                });
                let snapImage = () => {
                    let canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                    let image = canvas.toDataURL();
                    let success = image.length > 100000;
                    if (success) {
                        let img = document.createElement('img');
                        img.src = image;
                    }
                    return success;
                };

                video.addEventListener('timeupdate', timeupdate);
                video.preload = 'metadata';
                video.src = url;
                video.muted = true;
                video.play();

                fileReader.readAsArrayBuffer(file);
            }

        }

        */
        return new Promise(function (resolve, reject) {
            var request = {
                name: up.file.name,
                type: up.file.type,
                chat: up.chat.id
            };
            var self = _this;
            _this.socket.promise('s3-sign', request).then(function (res) {
                console.debug('got response: ', res);
                self.http.put(res.signed, up.file).subscribe(function (data) {
                    resolve({
                        url: res.url,
                        type: up.file.type,
                        name: up.file.name,
                        id: res.id
                    });
                }, function (err) { return reject('Error uploading file: ' + err); }, function () { return console.log('Successfully uploaded file: ', res); });
                /* old way of doing things for reference

                const xhr = new XMLHttpRequest();
                xhr.open('PUT', res.signedRequest);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve(res.url);
                        } else {
                            reject('error uploading');
                        }
                    }
                };
                xhr.send(file);
                */
            });
        });
    };
    AttachmentService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Platform, SocketService, Http, Events])
    ], AttachmentService);
    return AttachmentService;
}());
export { AttachmentService };
//# sourceMappingURL=attachment.js.map