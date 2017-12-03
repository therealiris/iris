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
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PeopleService } from '../../providers/people-service';
import { DiscoverPage } from '../discover/discover';
var Feedback = /** @class */ (function () {
    function Feedback(people, storage, navCtrl, navParams) {
        var _this = this;
        this.people = people;
        this.storage = storage;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.dummyrating = 4;
        storage.ready().then(function () {
            storage.get('currentUser').then(function (data) {
                if (data != null) {
                    console.log("here now filling profile", data);
                    _this.user = JSON.parse(data);
                }
            });
        });
    }
    Feedback.prototype.submitFeedback = function () {
        var _this = this;
        if (this.times && this.changes && this.beneficials && this.friends && this.motivation && this.anonymous) {
            var feed = { "uid": this.user.uid, "times": this.times, "changes": this.changes, "beneficials": this.beneficials, "friends": this.friends, "motivation": this.motivation, "anonymous": this.anonymous, "money": this.money };
            this.people.addFeedback(feed, function (status) {
                alert("Thank You for your valuable feedback. We have notified our team.");
                _this.navCtrl.setRoot(DiscoverPage);
            });
        }
        else
            alert("Please fill in all questions");
    };
    Feedback = __decorate([
        Component({
            selector: 'feedback',
            templateUrl: 'feedback.html',
            providers: [PeopleService]
        }),
        __metadata("design:paramtypes", [PeopleService, Storage, NavController, NavParams])
    ], Feedback);
    return Feedback;
}());
export { Feedback };
//# sourceMappingURL=feedback.js.map