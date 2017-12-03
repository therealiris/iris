var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, Slides } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, storage, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.loadingCtrl = loadingCtrl;
        this.showLogin = false;
        this.appUser = {
            "uid": "",
            "username": "",
            "email": "",
            "pictureUrl": "",
            "image": "",
            "fullName": "",
            "dob": "",
            "gender": "",
            "type": [],
            "industry": [],
            "designation": "",
            "currentWorkplace": "",
            "skills": [],
            "connections": [],
            "requested": [],
            "requests": [],
            "notifications": [],
            "events": [],
            "lastLoginLocation": "",
            "chatId": "",
            "pushId": "",
            "rating": 0,
            "ranking": 0,
            "score": 0,
            "password": "",
            "pendingRatings": [],
            "unread": []
        };
    }
    HomePage.prototype.login = function () {
        this.navCtrl.push(LoginPage, this.appUser, { animate: true, direction: 'forward' });
    };
    HomePage.prototype.slideChanged = function () {
        var currentIndex = this.slides.getActiveIndex();
        console.log(currentIndex);
        if (currentIndex === 2) {
            this.showLogin = true;
            this.slides.lockSwipeToNext(true);
        }
        else {
            this.showLogin = false;
            this.slides.lockSwipeToNext(false);
        }
    };
    __decorate([
        ViewChild(Slides),
        __metadata("design:type", Slides)
    ], HomePage.prototype, "slides", void 0);
    HomePage = __decorate([
        Component({
            selector: 'page-home',
            templateUrl: 'home.html'
        }),
        __metadata("design:paramtypes", [NavController, Storage, LoadingController])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.js.map