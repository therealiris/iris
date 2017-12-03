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
import { NavParams, ViewController } from 'ionic-angular';
import { PeopleService } from '../../providers/people-service';
import { Storage } from '@ionic/storage';
var ViewProfile = /** @class */ (function () {
    function ViewProfile(viewCtrl, navParams, storage, people) {
        this.viewCtrl = viewCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.people = people;
        // If we navigated to this page, we will have an item available as a nav param
        this.editable = false;
        this.profile = "personal";
        this.user = this.navParams.get("user");
        console.log(this.user);
    }
    ViewProfile.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    ViewProfile = __decorate([
        Component({
            selector: 'viewProfile',
            templateUrl: 'viewProfile.html',
            providers: [PeopleService]
        }),
        __metadata("design:paramtypes", [ViewController, NavParams, Storage, PeopleService])
    ], ViewProfile);
    return ViewProfile;
}());
export { ViewProfile };
//# sourceMappingURL=viewProfile.js.map