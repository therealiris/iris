// long press for small contact modal
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
var RatingModal = /** @class */ (function () {
    function RatingModal(storage, peopleService, viewCtrl, params, navCtrl) {
        var _this = this;
        this.storage = storage;
        this.peopleService = peopleService;
        this.viewCtrl = viewCtrl;
        this.params = params;
        this.navCtrl = navCtrl;
        this.allowed = false;
        this.alternate = true;
        this.rate = [];
        this.user = params.get("userObject");
        this.alternate = params.get("alternate");
        console.log(this.user);
        this.user.skills.forEach(function (skill) {
            _this.rate.push({ "skill": skill, "rating": 0 });
        });
        storage.ready().then(function () {
            storage.get('currentUser').then(function (data) {
                if (data != null) {
                    console.log("here now filling profile", data);
                    _this.currentUser = JSON.parse(data);
                }
            });
        });
    }
    RatingModal.prototype.modified = function () {
        console.log("logging");
        this.allowed = true;
    };
    RatingModal.prototype.submitRating = function () {
        var _this = this;
        this.rate.forEach(function (r) {
            if (r.rating > 0)
                _this.allowed = true;
        });
        console.log(this.rate);
        if (this.allowed) {
            this.peopleService.pushRating({ "uid": this.user.uid, "ratings": this.rate, "user": this.currentUser.uid }, function (status) {
                console.log(status);
                if (_this.alternate) {
                    _this.alternateRating();
                }
            });
            this.viewCtrl.dismiss({ status: true });
        }
        else
            alert("Please rate atleast one skill");
    };
    RatingModal.prototype.alternateRating = function () {
        var _this = this;
        this.peopleService.pushPendingRating({ "uid": this.user.uid, "user": this.currentUser.uid }, function (status) {
            _this.viewCtrl.dismiss({ status: false });
        });
    };
    RatingModal.prototype.rateLater = function () {
        var _this = this;
        {
            this.peopleService.pushPendingRating({ "uid": this.currentUser.uid, "user": this.user.uid }, function (status) {
                if (_this.alternate) {
                    _this.alternateRating();
                }
                _this.viewCtrl.dismiss({ status: false });
            });
        }
    };
    RatingModal = __decorate([
        Component({
            templateUrl: 'rating-modal.html',
            selector: 'rating-modal',
            providers: [PeopleService]
        }),
        __metadata("design:paramtypes", [Storage, PeopleService, ViewController, NavParams, NavController])
    ], RatingModal);
    return RatingModal;
}());
export { RatingModal };
//# sourceMappingURL=rating-modal.js.map