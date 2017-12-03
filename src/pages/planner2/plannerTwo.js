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
import { NavController, NavParams, ModalController, ViewController, LoadingController } from 'ionic-angular';
import { PeopleService } from '../../providers/people-service';
import { PlannerOne } from '../planner1/plannerOne';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { Calendar } from '@ionic-native/calendar';
var PlannerTwo = /** @class */ (function () {
    function PlannerTwo(loadingCtrl, calendar, viewCtrl, modalCtrl, navCtrl, navParams, people, storage) {
        var _this = this;
        this.loadingCtrl = loadingCtrl;
        this.calendar = calendar;
        this.viewCtrl = viewCtrl;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.people = people;
        this.storage = storage;
        storage.ready().then(function () {
            storage.get('currentUser').then(function (data) {
                if (data != null) {
                    _this.user = JSON.parse(data);
                }
            });
        });
        this.calendar.hasReadWritePermission().then(function (status) {
            if (!status)
                _this.calendar.requestReadWritePermission();
        });
        this.type = this.navParams.get("type");
        // If we navigated to this page, we will have an item available as a nav param
        this.minDate = moment().format('YYYY-MM-DD');
        this.maxDate = moment().add(30, 'days').format('YYYY-MM-DD');
        console.log(this.maxDate);
    }
    PlannerTwo.prototype.setupMeeting = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            spinner: "crescent",
            content: 'Setting up your new event. Please wait.'
        });
        loading.present();
        if (this.checkValidity()) {
            debugger;
            var meetingObject = {
                "uid": this.user.uid,
                "event": {
                    "from": this.eventDate + " " + this.timeStarts,
                    "to": this.eventDate + " " + this.timeStops,
                    "type": this.type,
                    "with": this.withObject,
                    "venue": this.venue,
                    "agenda": this.agenda,
                    "pending": true
                }
            };
            // alert(JSON.stringify(meetingObject))
            this.people.pushEvent(meetingObject, function (res) {
                if (res.status === 1) {
                    loading.dismiss();
                    _this.viewCtrl.dismiss();
                }
            });
        }
    };
    PlannerTwo.prototype.checkValidity = function () {
        debugger;
        var from = moment(this.eventDate + " " + this.timeStarts), to = moment(this.eventDate + " " + this.timeStops), current = moment(moment().format("YYYY-MM-DD HH:mm"));
        console.log(from, to, current);
        if (from.add(15, 'minutes') > to) {
            alert("Meetings should be a minimum of 15 minute duration");
            return false;
        }
        else if (from < current) {
            alert("Please select an appropriate meeting time");
            return false;
        }
        else if (from > current)
            return true;
    };
    PlannerTwo.prototype.selectUser = function () {
        var _this = this;
        var planModal = this.modalCtrl.create(PlannerOne);
        planModal.present();
        planModal.onDidDismiss(function (data) {
            if (data) {
                console.log(data.withObject);
                _this.withObject = data.withObject;
                _this.withUser = _this.withObject.fullName;
            }
        });
    };
    PlannerTwo.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    PlannerTwo = __decorate([
        Component({
            selector: 'plannerTwo',
            templateUrl: 'plannerTwo.html',
            providers: [PeopleService]
        }),
        __metadata("design:paramtypes", [LoadingController, Calendar, ViewController, ModalController, NavController, NavParams, PeopleService, Storage])
    ], PlannerTwo);
    return PlannerTwo;
}());
export { PlannerTwo };
//# sourceMappingURL=plannerTwo.js.map