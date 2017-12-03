// handles incoming and outgoing video calls
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ApplicationRef } from '@angular/core';
import { SocketService } from './socket';
import { AudioService } from './audio';
import { ContactService } from './contact';
import { VideoService } from './video';
import { Config } from '../app/config';
import { Platform } from 'ionic-angular';
import { Events, ModalController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
var CallService = /** @class */ (function () {
    function CallService(ref, sanitizer, events, modalCtrl, socket, platform, audio, contactService, video) {
        // browser compatability for web views
        var _this = this;
        this.ref = ref;
        this.sanitizer = sanitizer;
        this.events = events;
        this.modalCtrl = modalCtrl;
        this.socket = socket;
        this.platform = platform;
        this.audio = audio;
        this.contactService = contactService;
        this.video = video;
        this.maxTimer = 200000;
        this.facing = 'front';
        this.pickupTimeout = null;
        this.contact = null;
        this.isInCall = false;
        this.isCalling = false;
        this.isAnswering = false;
        //duplicateMessages
        this.muted = false;
        this.lastState = null;
        this.localStream = null;
        this.peerConnection = null;
        this.remoteVideo = null;
        this.localVideo = null;
        this.peerConnectionConfig = null;
        this.modalShowing = false;
        this.modal = null;
        window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
        window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
        // STUN/TURN ice servers for connection negotiation
        this.peerConnectionConfig = {
            'iceServers': Config.ice
        };
        this.socket.on('messageReceived', function (name, message) {
            // console.debug('Message', message);
            switch (message.type) {
                case 'call':
                    console.debug('incoming call...', message);
                    if (_this.isCalling) {
                        // we are trying to call eachother. just answer it automaticly
                        if (_this.contact.id == name) {
                            clearTimeout(_this.pickupTimeout);
                            _this.pickupTimeout = null;
                            _this.isCalling = false;
                            _this.isAnswering = true;
                            _this.answer();
                            return;
                        }
                        // ignore this incoming call if we are busy
                        _this.ignore(false, name);
                        return;
                    }
                    _this.audio.play('calling');
                    _this.pickupTimeout = setTimeout(function () {
                        console.log('Call took too long to pick up. Ending.');
                        _this.end();
                    }, _this.maxTimer);
                    // start a new call
                    _this.contact = _this.contactService.get(name);
                    _this.isAnswering = true;
                    _this.showModal();
                    _this.preview();
                    _this.refreshVideos();
                    break;
                case 'answer':
                    clearTimeout(_this.pickupTimeout);
                    _this.pickupTimeout = null;
                    _this.audio.stopAudioCalling();
                    _this.isInCall = true;
                    _this.isCalling = false;
                    AudioToggle.setAudioMode(AudioToggle.EARPIECE);
                    _this.refreshVideos();
                    _this.call(true, _this.contact.id);
                    break;
                case 'ignore':
                    _this.audio.stopAudioCalling();
                case 'cancel':
                    _this.audio.stopAudioCalling();
                    _this.end();
                    break;
                case 'end':
                    _this.audio.stopAudioCalling();
                    if (_this.isInCall || _this.isCalling || _this.isAnswering) {
                        _this.end();
                    }
                    break;
            }
            if (message.sdp) {
                _this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp), function () {
                    if (message.sdp.type == 'offer') {
                        _this.peerConnection.createAnswer(function (d) {
                            //							this.gotDescription.call(this, [d]);
                            _this.gotDescription(d);
                        }, function (e) {
                            console.log('error creating answer', e);
                        });
                    }
                });
            }
            else if (message.ice) {
                _this.peerConnection.addIceCandidate(new RTCIceCandidate(message.ice));
            }
        });
    }
    // place a new call
    CallService.prototype.triggerCall = function (contact) {
        var _this = this;
        this.audio.play('calling');
        AudioToggle.setAudioMode(AudioToggle.EARPIECE);
        this.showModal();
        if (this.isInCall) {
            return;
        }
        this.preview();
        this.pickupTimeout = setTimeout(function () {
            console.log('Call took too long to pick up. Ending.');
            _this.end();
        }, this.maxTimer);
        console.debug('calling ', contact);
        this.contact = this.contactService.get(contact);
        this.isCalling = true;
        this.socket.emit('sendMessage', contact, {
            type: 'call'
        });
    };
    // open the call modal
    CallService.prototype.showModal = function () {
        this.events.publish('call.trigger.show', this.contact);
        this.modalShowing = true;
    };
    ;
    CallService.prototype.gotDescription = function (description) {
        var _this = this;
        console.log('got description', description, this.contact);
        this.peerConnection.setLocalDescription(description, function () {
            _this.socket.emit('sendMessage', _this.contact.id, {
                'sdp': description
            });
        }, function (e) {
            console.log('set description error', e);
        });
    };
    CallService.prototype.gotIceCandidate = function (event) {
        if (event.candidate != null) {
            this.socket.emit('sendMessage', this.contact.id, {
                'ice': event.candidate
            });
        }
    };
    CallService.prototype.gotRemoteStream = function (event) {
        console.log('got remote stream');
        this.remoteVideo = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(event.stream));
        this.refreshVideos();
    };
    // a hacky way to make sure we get the latest video position reguardless of animations or transitions
    // another way might be to use iosrtc.observeVideo(video) or an $interval
    CallService.prototype.refreshVideos = function () {
        // tell the modal that we need to revresh the video
        this.ref.tick();
        if (!this.platform.is('cordova')) {
            return;
        }
        try {
            for (var x = 0; x <= 3000; x += 300) {
                console.log(x);
                setTimeout(cordova.plugins.iosrtc.refreshVideos, x);
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    ;
    CallService.prototype.hideModal = function () {
        this.audio.stopAudioCalling();
        this.events.publish('call.trigger.hide', true);
    };
    // end the call in either direction
    CallService.prototype.end = function () {
        var _this = this;
        this.audio.stopAudioCalling();
        if (this.peerConnection) {
            this.peerConnection.close();
        }
        this.localVideo = null;
        this.remoteVideo = null;
        this.isAnswering = false;
        this.isCalling = false;
        this.isInCall = false;
        this.localStream = null;
        this.video.disconnect().then(function () {
            _this.hideModal();
            _this.refreshVideos();
        });
        if (!this.contact) {
            return;
        }
        this.socket.emit('sendMessage', this.contact.id, {
            type: 'end'
        });
        this.contact = null;
    };
    // add local stream
    CallService.prototype.addStream = function (stream, timeout) {
        var _this = this;
        this.localStream = stream;
        setTimeout(function () {
            _this.localVideo = _this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(stream));
        }, timeout);
    };
    // preview local video as full screen
    CallService.prototype.preview = function () {
        var _this = this;
        this.video.connect(true, true, this.facing).then(function (stream) {
            _this.addStream(stream, 10);
        });
    };
    ;
    // begin a call using webrtc
    CallService.prototype.call = function (isInitiator, contactId) {
        var _this = this;
        console.log('calling ' + contactId + ', isInitiator: ' + isInitiator);
        var connect = function () {
            _this.peerConnection = new RTCPeerConnection(_this.peerConnectionConfig);
            _this.peerConnection.onicecandidate = _this.gotIceCandidate.bind(_this);
            _this.peerConnection.onaddstream = _this.gotRemoteStream.bind(_this);
            _this.peerConnection.oniceconnectionstatechange = function (event) {
                _this.lastState = event.target.iceConnectionState;
                console.debug('ice state', _this.lastState);
                if (_this.lastState === 'failed' || _this.lastState === 'disconnected' || _this.lastState === 'closed') {
                    _this.peerConnection = null;
                    _this.end();
                }
            };
            _this.peerConnection.addStream(_this.localStream);
            if (isInitiator) {
                //this.isCalling = true;
                console.debug('creating offer');
                _this.peerConnection.createOffer(function (d) {
                    //this.gotDescription.call(this, [d]);
                    _this.gotDescription(d);
                }, function (e) {
                    console.log('error creating offer', e);
                });
            }
            else {
                //this.isAnswering = true;
            }
        };
        if (!this.localStream) {
            this.video.connect(true, true, this.facing).then(function (stream) {
                _this.addStream(stream, 1000);
                connect();
            });
        }
        else {
            connect();
        }
        // session.on('sendMessage', data => {
        // 	Socket.emit('sendMessage', contact.id, {
        // 		type: 'phonertc_handshake',
        // 		data: JSON.stringify(data)
        // 	});
        // });
        //
        // this.Contact[contact.id] = session;
        //
    };
    // cancel a call being placed
    CallService.prototype.cancel = function () {
        this.audio.stopAudioCalling();
        this.socket.emit('sendMessage', this.contact.id, {
            type: 'cancel'
        });
        this.end();
    };
    ;
    // ignore an incomming call
    CallService.prototype.ignore = function (end, name) {
        this.audio.stopAudioCalling();
        this.socket.emit('sendMessage', name || this.contact.id, {
            type: 'ignore'
        });
        if (!end)
            return;
        this.end();
    };
    ;
    // answer in incoming call
    CallService.prototype.answer = function () {
        var _this = this;
        if (this.isInCall) {
            return;
        }
        this.audio.stopAudioCalling();
        AudioToggle.setAudioMode(AudioToggle.EARPIECE);
        clearTimeout(this.pickupTimeout);
        this.pickupTimeout = null;
        this.isInCall = true;
        this.isAnswering = false;
        this.call(false, this.contact.id);
        setTimeout(function () {
            _this.socket.emit('sendMessage', _this.contact.id, {
                type: 'answer'
            });
        });
        this.refreshVideos();
    };
    // swap the camera facing. defaults to front facing to start
    CallService.prototype.flip = function () {
        var _this = this;
        this.facing = this.facing == 'front' ? 'back' : 'front';
        this.video.connect(!this.muted, true, this.facing).then(function (stream) {
            console.debug('using new facing stream', stream);
            _this.addStream(stream, 0);
            _this.peerConnection.addStream(_this.localStream);
        });
    };
    // mute the microphone and attach a new stream to connection
    // note: doesnt seem to work quite right on all brwosers
    CallService.prototype.mute = function () {
        var _this = this;
        this.muted = !this.muted;
        console.debug((this.muted ? '' : 'un') + 'muting...');
        if (this.muted) {
            this.video.mute();
        }
        else {
            this.video.unmute().then(function (stream) {
                console.debug('using muted stream', stream);
                _this.addStream(stream, 0);
                _this.peerConnection.addStream(_this.localStream);
            });
        }
    };
    CallService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [ApplicationRef, DomSanitizer, Events, ModalController, SocketService, Platform, AudioService, ContactService, VideoService])
    ], CallService);
    return CallService;
}());
export { CallService };
//# sourceMappingURL=call.js.map