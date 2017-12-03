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
var PlannerOne = /** @class */ (function () {
    function PlannerOne(viewCtrl, navCtrl, navParams, people, storage) {
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
                    people.getConnections(_this.user.uid, function (connections) {
                        _this.connections = connections;
                    });
                }
            });
        });
    }
    PlannerOne.prototype.selectUser = function (index) {
        var withObject = this.connections[index];
        withObject["id"] = withObject["_id"].toString();
        delete withObject._id;
        this.viewCtrl.dismiss({ "withObject": withObject });
    };
    PlannerOne.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    PlannerOne = __decorate([
        Component({
            selector: 'plannerOne',
            templateUrl: 'plannerOne.html',
            providers: [PeopleService]
        }),
        __metadata("design:paramtypes", [ViewController, NavController, NavParams, PeopleService, Storage])
    ], PlannerOne);
    return PlannerOne;
}());
export { PlannerOne };
//# sourceMappingURL=plannerOne.js.map