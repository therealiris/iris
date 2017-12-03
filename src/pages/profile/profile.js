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
import { PeopleService } from '../../providers/people-service';
import { Storage } from '@ionic/storage';
import { OnboardingTwo } from '../onboarding2/on2';
import { OnboardingThree } from '../onboarding3/on3';
import { EditPic } from '../editPic/editPic';
var Profile = /** @class */ (function () {
    function Profile(modalCtrl, navCtrl, navParams, storage, people) {
        var _this = this;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.people = people;
        // If we navigated to this page, we will have an item available as a nav param
        this.editable = false;
        this.profile = "personal";
        this.user = { "uid": "", "pictureUrl": "", "fullName": "", "gender": "", "dob": "", "email": "", "designation": "", "currentWorkplace": "", "industry": [], "skills": [] };
        storage.ready().then(function () {
            storage.get('currentUser').then(function (data) {
                if (data != null) {
                    console.log("here now filling profile", data);
                    _this.user = JSON.parse(data);
                    _this.people.updateCurrentUser(_this.user.uid, function (user) {
                        _this.user = user.userObject;
                        _this.rate = _this.user.skills;
                    });
                }
            });
        });
    }
    Profile.prototype.editMode = function (val) {
        console.log("Editing profile", val);
        this.editable = val;
        if (!val) {
            this.saveUserMod();
        }
    };
    Profile.prototype.modify = function (attr, val) {
        this.user[attr] = val;
    };
    Profile.prototype.saveUserMod = function () {
        var _this = this;
        this.people.sendData(this.user, function (response) {
            // console.log(response)
            _this.storage.ready()
                .then(function () {
                _this.storage.set('currentUser', JSON.stringify(_this.user));
            });
        });
    };
    Profile.prototype.removeHobby = function (index) {
        console.log(this.user.skills);
        this.user.skills.splice(index, 1);
    };
    Profile.prototype.selectIndustry = function () {
        var _this = this;
        var industryModal = this.modalCtrl.create(OnboardingTwo, { 'list': this.industry });
        // this.navCtrl.push(OnboardingTwo, {callback:this.fillIndustry})
        industryModal.present();
        industryModal.onDidDismiss(function (data) {
            _this.user.industry = data.industryList;
        });
    };
    Profile.prototype.removeIndustry = function (index) {
        this.user.industry.splice(index, 1);
    };
    Profile.prototype.selectSkills = function () {
        var _this = this;
        var skillsModal = this.modalCtrl.create(OnboardingThree);
        // this.navCtrl.push(OnboardingTwo, {callback:this.fillIndustry})
        skillsModal.present();
        skillsModal.onDidDismiss(function (data) {
            _this.user.skills = [];
            data.skillsList.forEach(function (skill) {
                _this.user.skills.push({ "skill": skill, rating: 0 });
            });
        });
    };
    Profile.prototype.uploadPic = function () {
        if (this.editable) {
            var editPicModal = this.modalCtrl.create(EditPic, this.user);
            editPicModal.present();
        }
    };
    Profile = __decorate([
        Component({
            selector: 'profile',
            templateUrl: 'profile.html',
            providers: [PeopleService]
        }),
        __metadata("design:paramtypes", [ModalController, NavController, NavParams, Storage, PeopleService])
    ], Profile);
    return Profile;
}());
export { Profile };
//# sourceMappingURL=profile.js.map