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
import { NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { PeopleService } from '../../providers/people-service';
import { UserDetail } from '../userDetail/userDetail';
import { DiscoverPage } from '../discover/discover';
import { Storage } from '@ionic/storage';
import { Calendar } from '@ionic-native/calendar';
var NotificationPage = /** @class */ (function () {
    function NotificationPage(calendar, storage, events, modalCtrl, navCtrl, navParams, people) {
        var _this = this;
        this.calendar = calendar;
        this.storage = storage;
        this.events = events;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.people = people;
        // If we navigated to this page, we will have an item available as a nav param
        // let generalNotifications = this.storage.get("generalNotifications")
        // this.general = generalNotifications
        // console.log( generalNotifications)
        this.notificationType = "connections";
        this.uid = this.navParams.data.uid;
        this.requests = new Array();
        this.meetings = new Array();
        this.general = new Array();
        // this.uid = "758118e811e19b9ee236d467838a977a"
        this.people.getNotifications(this.uid, function (response) {
            _this.notifications = response.notifications;
            _this.notifications.forEach(function (notification) {
                if (notification.type === 1)
                    _this.requests.push(notification);
                if (notification.type === 2)
                    _this.meetings.push(notification);
                if (notification.type === 0)
                    _this.general.push(notification);
            });
            if (_this.requests.length < _this.meetings.length)
                _this.notificationType = "meetings";
            if (_this.meetings.length < _this.general.length)
                _this.notificationType = "general";
            console.log(_this.notifications);
        });
        this.events.publish('clearNewNotification');
    }
    NotificationPage.prototype.acceptConnect = function (index, acceptId) {
        var _this = this;
        // let index = e.target.dataset.index
        // console.log(index)
        // let acceptId = e.target.dataset.uid
        this.people.acceptConnect(this.uid, acceptId, function (response) {
            if (response.status == 1) {
                _this.requests.splice(index, 1);
                _this.events.publish("refreshContacts");
            }
        });
    };
    NotificationPage.prototype.rejectConnect = function (index, rejectId) {
        var _this = this;
        // let index = e.target.dataset.index
        // let rejectId = e.target.dataset.uid
        this.people.rejectConnect(this.uid, rejectId, function (response) {
            if (response.status == 1)
                _this.requests.splice(index, 1);
        });
    };
    NotificationPage.prototype.acceptMeeting = function (index) {
        var _this = this;
        // let index = e.target.dataset.index
        this.meetings[index].eventObject.pending = false;
        var acceptObject = { "uid": this.uid, "eventObject": this.meetings[index].eventObject };
        console.log(acceptObject.eventObject);
        this.people.acceptMeeting(acceptObject, function (response) {
            if (response.status == 1) {
                _this.meetings.splice(index, 1);
                _this.calendar.createEventWithOptions(acceptObject.eventObject.type + " with " + acceptObject.eventObject.with.fullName, acceptObject.eventObject.venue, acceptObject.eventObject.agenda, new Date(acceptObject.eventObject.from), new Date(acceptObject.eventObject.to), { "firstReminderMinutes": 5 })
                    .then(function (data) {
                    console.log(data);
                });
            }
        });
    };
    NotificationPage.prototype.rejectMeeting = function (index) {
        var _this = this;
        // let index = e.target.dataset.index
        var rejectObject = { "uid": this.uid, "eventObject": this.meetings[index].eventObject };
        this.people.rejectMeeting(rejectObject, function (response) {
            if (response.status == 1)
                _this.meetings.splice(index, 1);
        });
    };
    //To be Done
    NotificationPage.prototype.rescheduleMeeting = function (e) {
    };
    NotificationPage.prototype.showConnectionDetails = function (i) {
        var _this = this;
        var userDetail = this.requests[i];
        console.log(userDetail);
        var modal = this.modalCtrl.create(UserDetail, { "user": userDetail, "type": 1, "index": i });
        modal.present();
        modal.onDidDismiss(function (data) {
            if (data) {
                var response = data.status;
                var index = data.index;
                if (response)
                    _this.acceptConnect(index, _this.requests[index].uid);
                else
                    _this.rejectConnect(index, _this.requests[index].uid);
            }
        });
    };
    NotificationPage.prototype.showMeetingDetails = function (i) {
        var _this = this;
        var userDetail = this.meetings[i];
        console.log(userDetail);
        var modal = this.modalCtrl.create(UserDetail, { "user": userDetail, "type": 2, "index": i });
        modal.present();
        modal.onDidDismiss(function (data) {
            if (data) {
                var response = data.status;
                var index = data.index;
                if (response)
                    _this.acceptMeeting(index);
                else
                    _this.rejectMeeting(index);
            }
        });
    };
    NotificationPage.prototype.dismiss = function () {
        this.navCtrl.setRoot(DiscoverPage);
    };
    NotificationPage.prototype.clearGeneral = function () {
        debugger;
        this.general = [];
        this.people.clearGeneral(this.uid, function (status) {
            console.log("clearing general notification");
        });
    };
    NotificationPage = __decorate([
        Component({
            selector: 'notification',
            templateUrl: 'notification.html',
            providers: [PeopleService]
        }),
        __metadata("design:paramtypes", [Calendar, Storage, Events, ModalController, NavController, NavParams, PeopleService])
    ], NotificationPage);
    return NotificationPage;
}());
export { NotificationPage };
//# sourceMappingURL=notification.js.map