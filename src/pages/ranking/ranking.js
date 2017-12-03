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
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { PeopleService } from '../../providers/people-service';
import { Storage } from '@ionic/storage';
var Ranking = /** @class */ (function () {
    function Ranking(loadingCtrl, navCtrl, navParams, storage, people) {
        var _this = this;
        this.loadingCtrl = loadingCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.people = people;
        // If we navigated to this page, we will have an item available as a nav param
        this.user = { "pictureUrl": "" };
        this.info = { "score": 0, "ranking": 0 };
        this.rates = [];
        var loading = this.loadingCtrl.create({
            spinner: "crescent",
            content: 'Loading rankings. Please give us a moment.'
        });
        loading.present();
        storage.ready().then(function () {
            storage.get('currentUser').then(function (data) {
                if (data != null) {
                    console.log("here now filling profile", data);
                    _this.user = JSON.parse(data);
                    _this.people.ranking(_this.user.uid, function (rankings) {
                        console.log(rankings);
                        _this.info = rankings.userInfo;
                        _this.rankList = rankings.rankedList;
                        _this.rankList.forEach(function (rank) {
                            _this.rates.push(parseFloat(rank.rating));
                        });
                        loading.dismiss();
                        // console.log(this.rates)
                    });
                }
            });
        });
    }
    Ranking = __decorate([
        Component({
            selector: 'ranking',
            templateUrl: 'ranking.html',
            providers: [PeopleService]
        }),
        __metadata("design:paramtypes", [LoadingController, NavController, NavParams, Storage, PeopleService])
    ], Ranking);
    return Ranking;
}());
export { Ranking };
//# sourceMappingURL=ranking.js.map