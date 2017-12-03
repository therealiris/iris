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
import { NavController, NavParams, LoadingController, ModalController, AlertController, Events } from 'ionic-angular';
import { OnboardingTwo } from '../onboarding2/on2';
import { OnboardingThree } from '../onboarding3/on3';
import { Storage } from '@ionic/storage';
import { PeopleService } from '../../providers/people-service';
var OnboardingOne = /** @class */ (function () {
    function OnboardingOne(events, alertCtrl, modalCtrl, navCtrl, navParams, storage, people, loadingCtrl) {
        this.events = events;
        this.alertCtrl = alertCtrl;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.people = people;
        this.loadingCtrl = loadingCtrl;
        this.industry = [];
        this.skills = [];
        this.form = 'on1';
        this.rangeVal = 0;
        this.skills = [];
        // this.user = {
        // "uid" : "", 
        // "email" : "", 
        // "pictureUrl" : "../assets/img/faces/sid.jpg",
        // "fullName":"",
        // "dob":"",
        // "gender":"",
        // "type":[],
        // "industry":[],
        // "designation":"",
        // "currentWorkplace":"",
        // "skills":[],
        // "connections" : [], 
        // "requested" : [], 
        // "requests" : [], 
        // "lastLoginLocation" : "", 
        // "chatId" : "",
        // "rating":0,
        // "ranking":0,
        // "score":0
        // }
        this.user = this.navParams.data;
        // console.log(this.user)
        // If we navigated to this page, we will have an item available as a nav param
        // Let's populate this page with some filler content for funzies
    }
    OnboardingOne.prototype.checkType = function (data) {
        // let me = this
        // data.forEach((skill)=>{
        //   me.industry.push({"skill":skill,"rating":0})
        // })
        if (this.pr && this.ent)
            this.type = ["professional", "entrepreneur"];
        else if (this.pr && !this.ent)
            this.type = ["professional"];
        else if (this.ent && !this.pr)
            this.type = ["entrepreneur"];
        else
            this.type = [];
        // console.log(data, this.pr, this.ent)
    };
    OnboardingOne.prototype.selectIndustry = function () {
        var _this = this;
        var industryModal = this.modalCtrl.create(OnboardingTwo, { 'list': this.industry });
        // this.navCtrl.push(OnboardingTwo, {callback:this.fillIndustry})
        industryModal.present();
        industryModal.onDidDismiss(function (data) {
            _this.industry = data.industryList;
        });
    };
    OnboardingOne.prototype.selectSkills = function () {
        var _this = this;
        var skillsModal = this.modalCtrl.create(OnboardingThree);
        // this.navCtrl.push(OnboardingTwo, {callback:this.fillIndustry})
        skillsModal.present();
        skillsModal.onDidDismiss(function (data) {
            _this.skills = [];
            data.skillsList.forEach(function (skill) {
                _this.skills.push({ "skill": skill, rating: 0 });
            });
        });
    };
    OnboardingOne.prototype.itemTapped = function (event) {
        if (event.keyCode == 13) {
            if (this.skills.length <= 2) {
                this.skills.push({ skill: event.target.value, rating: 0 });
                event.target.value = "";
                // console.log(this.skills)
            }
            else
                alert("You can add a maximum of three skills");
        }
    };
    OnboardingOne.prototype.presentLoadingDefault = function (userData) {
        var _this = this;
        this.storage.set("discoverTutorial", true);
        this.storage.set("contactsTutorial", true);
        this.storage.set("plannerTutorial", true);
        var loading = this.loadingCtrl.create({
            spinner: "crescent",
            content: 'Accessing IRIS ecosystem..Please wait...'
        });
        loading.present();
        setTimeout(function () {
            loading.dismiss();
            _this.events.publish('configureUser', { "userData": userData });
            // window.location.reload()
        }, 1500);
    };
    OnboardingOne.prototype.removeHobby = function (index) {
        console.log(index);
        this.skills.splice(index, 1);
    };
    OnboardingOne.prototype.removeIndustry = function (index) {
        // console.log(index)
        this.industry.splice(index, 1);
    };
    OnboardingOne.prototype.noChange = function (e) {
        if (this.form === 'on1')
            e.value = 0;
        if (this.form === 'on2')
            e.value = 40;
        if (this.form === 'on3')
            e.value = 80;
    };
    OnboardingOne.prototype.nextClick = function () {
        if (this.form === 'on1') {
            if (this.fullName && this.dob && this.gender && this.email) {
                this.user.fullName = this.fullName;
                this.user.dob = this.dob;
                this.user.gender = this.gender;
                this.user.email = this.email;
                this.form = 'on2';
                this.rangeVal = 40;
            }
            else
                alert("All fields are necessary for onboarding");
        }
        else if (this.form === 'on2') {
            if (this.designation && this.industry.length > 0 && this.type.length > 0 && this.currentWorkplace) {
                this.user.designation = this.designation;
                this.user.industry = this.industry;
                this.user.type = this.type;
                this.user.currentWorkplace = this.currentWorkplace;
                this.form = 'on3';
                this.rangeVal = 80;
            }
            else
                alert("All fields are necessary for onboarding");
        }
        else {
            if (this.skills.length > 0) {
                this.user.skills = this.skills;
                this.rangeVal = 100;
                this.presentTerms();
                // console.log(this.user)
            }
            else
                alert("Please add atleast one skill");
        }
    };
    OnboardingOne.prototype.presentTerms = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Terms & Conditions',
            message: "In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Iris a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.Your Content must be your own and must not be invading any third-party’s rights. Iris reserves the right to remove any of Your Content from this Website at any time without notice.",
            buttons: [
                {
                    text: 'Disagree',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Agree',
                    handler: function () {
                        _this.people.sendData(_this.user, function (response) {
                            // console.log(response)
                            _this.storage.ready()
                                .then(function () {
                                _this.storage.set('currentUser', JSON.stringify(_this.user));
                                _this.presentLoadingDefault(_this.user);
                            });
                        });
                    }
                }
            ]
        });
        alert.present();
    };
    OnboardingOne = __decorate([
        Component({
            selector: 'on-one',
            templateUrl: 'on1.html',
            providers: [PeopleService]
        }),
        __metadata("design:paramtypes", [Events, AlertController, ModalController, NavController, NavParams, Storage, PeopleService, LoadingController])
    ], OnboardingOne);
    return OnboardingOne;
}());
export { OnboardingOne };
//# sourceMappingURL=on1.js.map