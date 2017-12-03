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
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { PlannerTwo } from '../planner2/plannerTwo';
import { Storage } from '@ionic/storage';
import { PeopleService } from '../../providers/people-service';
import { Tutorial } from '../tutorial/tutorial';
import { Calendar } from '@ionic-native/calendar';
import { DiscoverPage } from '../discover/discover';
import { CallService } from '../../services';
var CalendarPage = /** @class */ (function () {
    function CalendarPage(callService, calendar, modalCtrl, navCtrl, navParams, people, storage) {
        var _this = this;
        this.callService = callService;
        this.calendar = calendar;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.people = people;
        this.storage = storage;
        // If we navigated to this page, we will have an item available as a nav param
        this.eventList = [];
        storage.get('plannerTutorial').then(function (val) {
            if (val) {
                var tut = _this.modalCtrl.create(Tutorial, { "type": "calendar" });
                tut.present();
                tut.onDidDismiss(function () {
                    _this.storage.set('plannerTutorial', false);
                });
            }
        });
        storage.ready().then(function () {
            storage.get('currentUser').then(function (data) {
                if (data != null) {
                    _this.user = JSON.parse(data);
                    people.getEvents(_this.user.uid, function (events) {
                        events.forEach(function (event) {
                            var min = new Date(event.from), max = new Date(event.to), now = new Date();
                            if (!(now > max)) {
                                if (now >= min && now <= max) {
                                    if (!event.pending)
                                        event["active"] = true;
                                    else
                                        event["active"] = false;
                                    _this.eventList.push(event);
                                    console.log(event);
                                }
                                else {
                                    event["active"] = false;
                                    _this.eventList.push(event);
                                    console.log(event);
                                }
                            }
                        });
                    });
                }
            });
        });
    }
    CalendarPage_1 = CalendarPage;
    CalendarPage.prototype.schedule = function (type) {
        var _this = this;
        var planModal = this.modalCtrl.create(PlannerTwo, {
            "type": type
        });
        planModal.present();
        planModal.onDidDismiss(function () {
            _this.navCtrl.setRoot(CalendarPage_1);
        });
    };
    CalendarPage.prototype.syncItem = function (i) {
        var eventObject = this.eventList[i], reminder = 15;
        if (eventObject.type === 'meeting')
            reminder = 40;
        this.calendar.createEventInteractivelyWithOptions(eventObject.type + " with " + eventObject.with.fullName, eventObject.venue, eventObject.agenda, new Date(eventObject.from), new Date(eventObject.to), { "firstReminderMinutes": reminder });
    };
    CalendarPage.prototype.call = function (i) {
        this.callService.triggerCall(this.eventList[i].with.id);
    };
    CalendarPage.prototype.back = function () {
        this.navCtrl.setRoot(DiscoverPage);
    };
    CalendarPage = CalendarPage_1 = __decorate([
        Component({
            selector: 'calendar',
            templateUrl: 'calendar.html',
            providers: [PeopleService]
        }),
        __metadata("design:paramtypes", [CallService, Calendar, ModalController, NavController, NavParams, PeopleService, Storage])
    ], CalendarPage);
    return CalendarPage;
    var CalendarPage_1;
}());
export { CalendarPage };
//# sourceMappingURL=calendar.js.map