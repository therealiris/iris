// call modal display
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ModalController, NavParams, Events, ViewController } from 'ionic-angular';
import { CallService } from '../../services/call';
import { PeopleService } from '../../providers/people-service';
import { RatingModal } from '../../pages/rating-modal/rating-modal';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';
var CallModal = /** @class */ (function () {
    function CallModal(localNotifications, backgroundMode, modalCtrl, people, params, events, viewCtrl, callService) {
        var _this = this;
        this.localNotifications = localNotifications;
        this.backgroundMode = backgroundMode;
        this.modalCtrl = modalCtrl;
        this.people = people;
        this.events = events;
        this.viewCtrl = viewCtrl;
        this.callService = callService;
        this.audioSwitched = false;
        this.events.subscribe('call.trigger.hide', function (data) {
            _this.hide();
        });
        // this.localNotifications.schedule({
        //         id: 1,
        //         title : 'Incoming Call',
        //         text: 'You are recieving a call. Tap to accept.',
        //         at: new Date(new Date().getTime() + 20)
        //       });
    }
    CallModal.prototype.hide = function () {
        this.events.publish('call.status.isincall', false);
        this.callService.refreshVideos();
        this.viewCtrl.dismiss();
    };
    CallModal.prototype.ngOnInit = function () {
        this.events.publish('call.status.isincall', true);
    };
    CallModal.prototype.endCall = function () {
        var _this = this;
        console.log("end call called", this.callService.contact.id);
        this.people.userById(this.callService.contact.id.toString(), function (user) {
            var pendingRatingModal = _this.modalCtrl.create(RatingModal, { "userObject": user, "alternate": true });
            pendingRatingModal.present();
            _this.callService.end();
        });
    };
    CallModal.prototype.switchAudio = function () {
        if (!this.audioSwitched) {
            this.audioSwitched = true;
            AudioToggle.setAudioMode(AudioToggle.SPEAKER);
        }
        else {
            this.audioSwitched = false;
            AudioToggle.setAudioMode(AudioToggle.EARPIECE);
        }
    };
    CallModal = __decorate([
        Component({
            templateUrl: 'call-modal.html',
            selector: 'modal-call'
        }),
        __metadata("design:paramtypes", [LocalNotifications, BackgroundMode, ModalController, PeopleService, NavParams, Events, ViewController, CallService])
    ], CallModal);
    return CallModal;
}());
export { CallModal };
//# sourceMappingURL=call-modal.js.map