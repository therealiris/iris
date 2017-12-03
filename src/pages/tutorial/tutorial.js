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
var Tutorial = /** @class */ (function () {
    function Tutorial(viewCtrl, navCtrl, navParams) {
        this.viewCtrl = viewCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        // If we navigated to this page, we will have an item available as a nav param
        this.type = this.navParams.get("type");
    }
    Tutorial.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    Tutorial = __decorate([
        Component({
            selector: 'tutorial',
            templateUrl: 'tutorial.html'
        }),
        __metadata("design:paramtypes", [ViewController, NavController, NavParams])
    ], Tutorial);
    return Tutorial;
}());
export { Tutorial };
//# sourceMappingURL=tutorial.js.map