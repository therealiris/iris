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
import { PeopleService } from '../../providers/people-service';
import { Storage } from '@ionic/storage';
var Profile = (function () {
    function Profile(navCtrl, navParams, storage, people) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.people = people;
        // If we navigated to this page, we will have an item available as a nav param
        this.profile = "personal";
        this.user = { "pictureUrl": "", "fullName": "", "gender": "", "dob": "", "hobbies": [], "email": "", "designation": "", "currentWorkplace": "", "industry": [], "skills": [] };
        storage.ready().then(function () {
            storage.get('currentUser').then(function (data) {
                if (data != null) {
                    console.log("here now filling profile", data);
                    _this.user = JSON.parse(data);
                    _this.rate = _this.user.skills;
                }
            });
        });
    }
    return Profile;
}());
Profile = __decorate([
    Component({
        selector: 'profile',
        templateUrl: 'profile.html',
        providers: [PeopleService]
    }),
    __metadata("design:paramtypes", [NavController, NavParams, Storage, PeopleService])
], Profile);
export { Profile };
//# sourceMappingURL=profile.js.map