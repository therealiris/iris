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
var sendRequest = /** @class */ (function () {
    function sendRequest(viewCtrl, navCtrl, navParams, people, storage) {
        var _this = this;
        this.viewCtrl = viewCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.people = people;
        this.storage = storage;
        // If we navigated to this page, we will have an item available as a nav param
        storage.ready().then(function () {
            storage.get('currentUser').then(function (data) {
                if (data != null) {
                    _this.user = JSON.parse(data);
                }
            });
        });
        // this.user = {"uid":'GYILtCA0OJ'}   //local testing
        this.selectedItem = navParams.get('item');
        this.showPoints = false;
        this.allow = false;
        this.item = this.navParams.data.item;
    }
    sendRequest.prototype.enableConnect = function () {
        if (this.reasons.length > 0)
            this.allow = true;
    };
    sendRequest.prototype.cancel = function () {
        this.viewCtrl.dismiss();
    };
    sendRequest.prototype.connect = function () {
        var _this = this;
        var reasonString = this.reasons + "||" + this.reasonMessage;
        this.people.sendRequest(this.user, this.item.uid, reasonString, function (res) {
            if (res.status == 1)
                _this.viewCtrl.dismiss({ "justRequested": _this.item.uid });
        });
    };
    sendRequest = __decorate([
        Component({
            selector: 'sendRequest',
            templateUrl: 'sendRequest.html',
            providers: [PeopleService]
        }),
        __metadata("design:paramtypes", [ViewController, NavController, NavParams, PeopleService, Storage])
    ], sendRequest);
    return sendRequest;
}());
export { sendRequest };
//# sourceMappingURL=sendRequest.js.map