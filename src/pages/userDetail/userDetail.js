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
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { PeopleService } from '../../providers/people-service';
import { Storage } from '@ionic/storage';
import { Calendar } from '@ionic-native/calendar';
var UserDetail = /** @class */ (function () {
    function UserDetail(calendar, viewCtrl, navCtrl, navParams, people, storage) {
        this.calendar = calendar;
        this.viewCtrl = viewCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.people = people;
        this.storage = storage;
        // If we navigated to this page, we will have an item available as a nav param
        this.user = this.navParams.get("user");
        this.type = this.navParams.get("type");
        this.index = this.navParams.get("index");
        console.log("user detail", this.user);
        if (this.type === 1) {
            var totalMessage = this.user.reason.split("||");
            this.reasonHeading = totalMessage[0];
            this.reasonMessage = totalMessage[1];
        }
    }
    UserDetail.prototype.acceptRequest = function () {
        this.viewCtrl.dismiss({ "type": 1, "status": true, "index": this.index });
    };
    UserDetail.prototype.rejectRequest = function () {
        this.viewCtrl.dismiss({ "type": 1, "status": false, "index": this.index });
    };
    UserDetail.prototype.acceptMeeting = function () {
        this.viewCtrl.dismiss({ "type": 2, "status": true, "index": this.index });
    };
    UserDetail.prototype.rejectMeeting = function () {
        this.viewCtrl.dismiss({ "type": 2, "status": false, "index": this.index });
    };
    UserDetail.prototype.justDismiss = function () {
        this.viewCtrl.dismiss();
    };
    UserDetail.prototype.openCalendar = function () {
        this.calendar.openCalendar(new Date(this.user.eventObject.from));
    };
    UserDetail = __decorate([
        Component({
            selector: 'userDetail',
            templateUrl: 'userDetail.html',
            providers: [PeopleService]
        }),
        __metadata("design:paramtypes", [Calendar, ViewController, NavController, NavParams, PeopleService, Storage])
    ], UserDetail);
    return UserDetail;
}());
export { UserDetail };
//# sourceMappingURL=userDetail.js.map