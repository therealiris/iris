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
import { NavController, NavParams, LoadingController, ModalController, Events } from 'ionic-angular';
import { sendRequest } from '../sendRequest/sendRequest';
import { FilterPage } from '../filterPage/filter';
import { NotificationPage } from '../notification/notification';
import { RatingModal } from '../rating-modal/rating-modal';
import { Tutorial } from '../tutorial/tutorial';
import { PeopleService } from '../../providers/people-service';
import { Storage } from '@ionic/storage';
import { Slides } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
var DiscoverPage = /** @class */ (function () {
    function DiscoverPage(events, modalCtrl, navCtrl, loadingCtrl, navParams, people, storage) {
        var _this = this;
        this.events = events;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.navParams = navParams;
        this.people = people;
        this.storage = storage;
        this.user = { "notifications": [""] };
        storage.get('discoverTutorial').then(function (val) {
            if (val) {
                var tut = _this.modalCtrl.create(Tutorial, { "type": "discover" });
                tut.present();
                tut.onDidDismiss(function () {
                    _this.storage.set('discoverTutorial', false);
                });
            }
        });
        this.currentIndex = 0;
        this.rate = [];
        this.pendingRatings = [];
        this.localRequested = [];
        this.ratingCount = 0;
        // If we navigated to this page, we will have an item available as a nav param
        this.showPoints = false;
        this.events.subscribe("unread", function () {
            _this.refresh();
        });
        // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO).then(
        //   success => {
        //     this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.RECORD_AUDIO)
        //     console.log("success")
        //      },
        //   err => this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.RECORD_AUDIO)
        // );
        storage.ready().then(function () {
            storage.get('currentUser').then(function (data) {
                if (data != null) {
                    _this.user = JSON.parse(data);
                    people.updateCurrentUser(_this.user.uid, function (user) {
                        _this.user = user.userObject;
                        _this.pendingRatings = user.userObject.pendingRatings;
                        if (user.userObject.unread.length > 0)
                            _this.events.publish("hamburgerOn", { "num": user.userObject.unread.length });
                        // console.log(this.pendingRatings)
                        _this.lat = _this.user.lastLoginLocation.split(",")[0];
                        _this.long = _this.user.lastLoginLocation.split(",")[1];
                        _this.startDiscover();
                        _this.locationUpdate();
                    });
                }
            });
        });
    }
    DiscoverPage.prototype.showRatings = function () {
        var _this = this;
        // console.log("Pending Ratings Block")
        if (this.ratingCount < 2) {
            var loading_1 = this.loadingCtrl.create({
                spinner: "crescent",
                content: 'Loading pending ratings'
            });
            loading_1.present();
            this.people.updateCurrentUser(this.pendingRatings[this.ratingCount], function (user) {
                var pendingRatingModal = _this.modalCtrl.create(RatingModal, { "userObject": user.userObject, "alternate": false });
                loading_1.dismiss();
                pendingRatingModal.present();
                pendingRatingModal.onDidDismiss(function (data) {
                    if (data.status)
                        _this.pendingRatings.splice(_this.ratingCount, 1);
                });
            });
        }
    };
    DiscoverPage.prototype.startDiscover = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            spinner: "crescent",
            content: 'Loading profiles..'
        });
        loading.present();
        this.people.discover(this.user.uid, this.filter, function (discoverList) {
            var filteredList = new Array();
            discoverList.forEach(function (listItem, index) {
                if (!(listItem.uid === _this.user.uid || _this.user.connections.indexOf(listItem.uid) > -1 || _this.user.requests.indexOf(listItem.uid) > -1 || _this.user.requested.indexOf(listItem.uid) > -1)) {
                    filteredList.push(listItem);
                }
            });
            _this.items = filteredList;
            for (var i = 0; i < _this.items.length; i++) {
                var totalRating = 0;
                _this.items[i].skills.forEach(function (skill) {
                    totalRating += skill.rating;
                });
                var avgRating = totalRating / _this.items[i].skills.length;
                _this.rate.push(avgRating);
                var locationArr = _this.items[i].lastLoginLocation.split(",");
                var distance = _this.getDistanceFromLatLonInKm(_this.lat, _this.long, parseFloat(locationArr[0]), parseFloat(locationArr[1]));
                var numDist = distance.toFixed(2);
                _this.items[i].distance = numDist;
            }
            loading.dismiss();
            // this.locationUpdate()
            _this.slides.lockSwipeToNext(false);
            _this.slides.slideTo(0, 500);
            // console.log(this.currentIndex)
        });
    };
    DiscoverPage.prototype.locationUpdate = function () {
        var _this = this;
        // console.log("updating location")
        Geolocation.getCurrentPosition().then(function (res) {
            // console.log(res.coords.latitude,res.coords.longitude)
            _this.lat = res.coords.latitude;
            _this.long = res.coords.longitude;
            _this.user.lastLoginLocation = _this.lat + "," + _this.long;
            _this.people.updateLocation(_this.user.uid, _this.user.lastLoginLocation, function (response) {
                // console.log("UPDATED LOGIN LOCATION")
                // this.showRatings()
            });
        }).catch(function (error) {
            alert("error in locating");
        });
    };
    DiscoverPage.prototype.getDistanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    };
    DiscoverPage.prototype.deg2rad = function (deg) {
        return deg * (Math.PI / 180);
    };
    DiscoverPage.prototype.slideChanged = function () {
        // this.showPoints = true
        // setTimeout(()=>{
        //   this.showPoints = false
        // },800)
        this.currentIndex = this.slides.getActiveIndex();
        if (this.localRequested.indexOf(this.items[this.currentIndex]['uid']) > -1)
            this.isConnected = true;
        else
            this.isConnected = false;
        // console.log(this.currentIndex)
        if (this.currentIndex === this.items.length - 1)
            this.slides.lockSwipeToNext(true);
        else
            this.slides.lockSwipeToNext(false);
    };
    DiscoverPage.prototype.connect = function () {
        var _this = this;
        var item = this.items[this.currentIndex];
        // console.log("hauchi")
        var connectModal = this.modalCtrl.create(sendRequest, {
            "item": item
        });
        connectModal.present();
        connectModal.onDidDismiss(function (data) {
            if (data) {
                _this.localRequested.push(data.justRequested);
                _this.isConnected = true;
            }
        });
        // this.navCtrl.push(sendRequest, {
        //   item: item
        // });
    };
    DiscoverPage.prototype.openNotifications = function () {
        this.navCtrl.push(NotificationPage, { "uid": this.user.uid });
    };
    DiscoverPage.prototype.refresh = function () {
        var _this = this;
        this.people.updateCurrentUser(this.user.uid, function (user) {
            _this.user = user.userObject;
        });
    };
    DiscoverPage.prototype.search = function (fab) {
        var _this = this;
        var filterModal = this.modalCtrl.create(FilterPage, { "filter": this.filter });
        // this.navCtrl.push(OnboardingTwo, {callback:this.fillIndustry})
        filterModal.present();
        filterModal.onDidDismiss(function (data) {
            // console.log(data)
            _this.filter = data.filter;
            if (_this.filter.type.length > 0 || _this.filter.industry.length > 0 || _this.filter.skills.length > 0) {
                _this.startDiscover();
                fab.close();
            }
            else {
                _this.filter = undefined;
                _this.startDiscover();
            }
        });
    };
    DiscoverPage.prototype.clearFilter = function (fab) {
        this.filter = undefined;
        this.startDiscover();
        fab.close();
    };
    __decorate([
        ViewChild(Slides),
        __metadata("design:type", Slides)
    ], DiscoverPage.prototype, "slides", void 0);
    DiscoverPage = __decorate([
        Component({
            selector: 'discover-list',
            templateUrl: 'discover.html',
            providers: [PeopleService]
        }),
        __metadata("design:paramtypes", [Events, ModalController, NavController, LoadingController, NavParams, PeopleService, Storage])
    ], DiscoverPage);
    return DiscoverPage;
}());
export { DiscoverPage };
//# sourceMappingURL=discover.js.map