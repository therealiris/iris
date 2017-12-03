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
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { OnboardingTwo } from '../onboarding2/on2';
import { OnboardingThree } from '../onboarding3/on3';
var FilterPage = /** @class */ (function () {
    function FilterPage(viewCtrl, modalCtrl, navCtrl, navParams) {
        this.viewCtrl = viewCtrl;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.industry = [];
        this.skills = [];
        this.type = [];
        var filterData = this.navParams.data.filter;
        if (filterData) {
            this.type = filterData.type;
            this.industry = filterData.industry;
            this.skills = filterData.skills;
            if (this.type.indexOf("professional") > -1)
                this.pr = true;
            if (this.type.indexOf("entrepreneur") > -1)
                this.ent = true;
        }
    }
    FilterPage.prototype.checkType = function () {
        if (this.pr && this.ent)
            this.type = ["professional", "entrepreneur"];
        else if (this.pr && !this.ent)
            this.type = ["professional"];
        else if (this.ent && !this.pr)
            this.type = ["entrepreneur"];
        else
            this.type = [];
    };
    FilterPage.prototype.selectIndustry = function () {
        var _this = this;
        var industryModal = this.modalCtrl.create(OnboardingTwo, { 'list': this.industry });
        // this.navCtrl.push(OnboardingTwo, {callback:this.fillIndustry})
        industryModal.present();
        industryModal.onDidDismiss(function (data) {
            _this.industry = data.industryList;
        });
    };
    FilterPage.prototype.selectSkills = function () {
        var _this = this;
        var skillsModal = this.modalCtrl.create(OnboardingThree);
        // this.navCtrl.push(OnboardingTwo, {callback:this.fillIndustry})
        skillsModal.present();
        skillsModal.onDidDismiss(function (data) {
            data.skillsList.forEach(function (skill) {
                _this.skills.push({ "skill": skill, rating: 0 });
            });
        });
    };
    FilterPage.prototype.removeHobby = function (index) {
        console.log(index);
        this.skills.splice(index, 1);
    };
    FilterPage.prototype.removeIndustry = function (index) {
        // console.log(index)
        this.industry.splice(index, 1);
    };
    FilterPage.prototype.passFilter = function () {
        this.viewCtrl.dismiss({ "filter": { "industry": this.industry, "skills": this.skills, "type": this.type } });
    };
    FilterPage = __decorate([
        Component({
            selector: 'filter-page',
            templateUrl: 'filter.html'
        }),
        __metadata("design:paramtypes", [ViewController, ModalController, NavController, NavParams])
    ], FilterPage);
    return FilterPage;
}());
export { FilterPage };
//# sourceMappingURL=filter.js.map