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
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { PeopleService } from '../../providers/people-service';
import { Storage } from '@ionic/storage';
import { DiscoverPage } from '../discover/discover';
import { UploadPic } from '../uploadPic/uploadPic';
import * as moment from 'moment';
import md5 from 'md5';
import { AndroidPermissions } from '@ionic-native/android-permissions';
var LoginPage = /** @class */ (function () {
    function LoginPage(androidPermissions, events, navCtrl, loadingCtrl, navParams, people, storage) {
        this.androidPermissions = androidPermissions;
        this.events = events;
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.navParams = navParams;
        this.people = people;
        this.storage = storage;
        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.WAKE_LOCK, this.androidPermissions.PERMISSION.MODIFY_PHONE_STATE, this.androidPermissions.PERMISSION.RECORD_AUDIO, this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION]);
        this.numberSent = false;
        this.appUser = this.navParams.data;
        // console.log(this.appUser)
    }
    LoginPage.prototype.sendNumber = function () {
        var _this = this;
        this.countDownStopped = false;
        if (this.phone != null && this.phone.toString().length === 10) {
            var loading_1 = this.loadingCtrl.create({
                spinner: "crescent",
                content: 'Sending OTP to your phone..'
            });
            loading_1.present();
            // this.otp = 5555
            this.otp = Math.floor(1000 + Math.random() * 9000);
            this.people.sendOtp(this.phone, this.otp, function (response) {
                if (null != response) {
                    _this.numberSent = true;
                    loading_1.dismiss();
                    var now = moment();
                    var then = moment().add(59, 'seconds');
                    _this.startCountDown(now, then);
                }
            });
        }
        else {
            alert("Please enter a valid phone number");
        }
    };
    LoginPage.prototype.validate = function () {
        var _this = this;
        var validationModal = this.loadingCtrl.create({
            spinner: "crescent",
            content: 'Validating OTP'
        });
        validationModal.present();
        setTimeout(function () {
            validationModal.dismiss();
            if (_this.otpField.toString().length > 3) {
                var loading_2 = _this.loadingCtrl.create({
                    spinner: "crescent",
                    content: 'Configuring IRIS Account.'
                });
                loading_2.present();
                if (_this.otpField.toString() === _this.otp.toString()) {
                    setTimeout(function () {
                        loading_2.dismiss();
                    }, 2000);
                    _this.appUser.uid = md5(_this.phone);
                    _this.appUser.username = _this.appUser.uid;
                    _this.people.updateCurrentUser(_this.appUser.uid, function (response) {
                        if (response.status === 1) {
                            //if user already logged-in
                            _this.appUser = response.userObject;
                            _this.storage.ready().then(function () {
                                _this.storage.set('currentUser', JSON.stringify(_this.appUser));
                                _this.events.publish('configureUser', { "userData": _this.appUser });
                                _this.navCtrl.setRoot(DiscoverPage);
                            });
                        }
                        else {
                            _this.navCtrl.setRoot(UploadPic, _this.appUser, { animate: true, direction: 'forward' });
                        }
                    });
                }
                else {
                    alert("Invalid OTP");
                    loading_2.dismiss();
                }
            }
            else {
                alert("Invalid OTP");
            }
        }, 1500);
    };
    LoginPage.prototype.startCountDown = function (now, then) {
        var _this = this;
        var nowString = now.toString(), thenString = then.toString();
        if (nowString != thenString) {
            console.log(nowString, thenString);
            setTimeout(function () {
                var diff = then - now;
                var duration = moment.duration(diff, 'seconds');
                _this.timer = moment.utc(diff).format("mm:ss").toString();
                then = moment(then).subtract(1, 'second');
                _this.startCountDown(now, then);
            }, 1000);
        }
        else {
            this.countDownStopped = true;
        }
    };
    LoginPage = __decorate([
        Component({
            selector: 'login',
            templateUrl: 'login.html',
            providers: [PeopleService]
        }),
        __metadata("design:paramtypes", [AndroidPermissions, Events, NavController, LoadingController, NavParams, PeopleService, Storage])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.js.map