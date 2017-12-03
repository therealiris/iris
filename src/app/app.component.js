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
import { Nav, Platform, ToastController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { DiscoverPage } from '../pages/discover/discover';
import { CalendarPage } from '../pages/calendar/calendar';
import { Profile } from '../pages/profile/profile';
import { Ranking } from '../pages/ranking/ranking';
import { Feedback } from '../pages/feedback/feedback';
import { Storage } from '@ionic/storage';
import { Push } from '@ionic-native/push';
import { PeopleService } from '../providers/people-service';
import { ContactsPage } from '../pages';
import { CallService, LoginService, AudioService } from '../services';
import { CallModalTrigger } from '../components';
import * as moment from 'moment';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';
import { NativeAudio } from '@ionic-native/native-audio';
var MyApp = /** @class */ (function () {
    function MyApp(audioService, nativeAudio, backgroundMode, localNotifications, callService, loginService, events, callModal, people, platform, push, statusBar, splashScreen, toastCtrl, storage) {
        var _this = this;
        this.audioService = audioService;
        this.nativeAudio = nativeAudio;
        this.backgroundMode = backgroundMode;
        this.localNotifications = localNotifications;
        this.loginService = loginService;
        this.events = events;
        this.people = people;
        this.platform = platform;
        this.push = push;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.toastCtrl = toastCtrl;
        this.storage = storage;
        this.audio = [];
        this.volume = 1;
        this.isInCall = false;
        moment.locale('en', {
            relativeTime: {
                future: 'now',
                past: '%s',
                s: 'now',
                m: '1 m',
                mm: '%d m',
                h: '1 h',
                hh: '%d h',
                d: '1 d',
                dd: '%d d',
                M: '1 m',
                MM: '%d m',
                y: '1 y',
                yy: '%d y'
            }
        });
        this.audioService.stopAudioCalling();
        this.hamburgerNotification = false;
        this.unread = 0;
        this.unreadNotification = false;
        this.otherPage = false;
        this.initializeApp();
        this.user = { fullName: '', pictureUrl: '' };
        this.loginService.logout();
        storage.ready().then(function () {
            storage.get('currentUser').then(function (data) {
                if (data != null) {
                    _this.rootPage = DiscoverPage;
                    _this.user = JSON.parse(data);
                    _this.pushsetup();
                    _this.loginService.login({ "username": _this.user.uid, "password": "apptoken" }).then(function () {
                        _this.loginService.complete.then(function (user) { });
                    }, function (data) {
                        // console.log(data);
                    });
                }
                else {
                    _this.rootPage = HomePage;
                    // this.loginService.login({"username":"c0668107c590e75bb5c5361c6347e9a9","password":"apptoken"}).then(() => {
                    //   this.loginService.complete.then(user => {
                    //   })
                    // }, data => {
                    //     console.log("1",data);
                    //   });
                }
            });
        });
        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Discover', component: DiscoverPage, iconName: 'ios-search-outline', selected: false },
            { title: 'My Connections', component: ContactsPage, iconName: 'ios-people-outline', selected: false },
            { title: 'My Planner', component: CalendarPage, iconName: 'ios-calendar-outline', selected: false },
            { title: 'Ranking', component: Ranking, iconName: 'ios-trophy-outline', selected: false },
            { title: 'Feedback', component: Feedback, iconName: 'ios-settings', selected: false }
        ];
        events.subscribe('call.status.isincall', function (status) {
            if (_this.backgroundMode.isActive()) {
                _this.backgroundMode.wakeUp();
                // this.backgroundMode.unlock()
                _this.backgroundMode.moveToForeground();
            }
            else {
                _this.backgroundMode.moveToForeground();
            }
            // console.debug('call status changed to ', status);
            _this.isInCall = status;
        });
        events.subscribe('configureUser', function (data) {
            if (data != null) {
                _this.user = data.userData;
                _this.rootPage = DiscoverPage;
                _this.pushsetup();
                _this.loginService.login({ "username": _this.user.uid, "password": "apptoken" }).then(function () {
                    _this.loginService.complete.then(function (user) { });
                }, function (data) {
                    // console.log(data);
                });
            }
        });
        events.subscribe('clearNewNotification', function () {
            _this.unreadNotification = false;
        });
        events.subscribe('clearHamNotification', function () {
            _this.hamburgerNotification = false;
            _this.unread = 0;
            _this.people.clearUnread(_this.user.uid);
        });
        events.subscribe('hamburgerOn', function (data) {
            _this.hamburgerNotification = true;
            _this.unread = data.num;
        });
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.backgroundMode.setDefaults({ silent: true });
            _this.backgroundMode.enable();
            _this.platform.registerBackButtonAction(function () {
                var view = _this.nav.getActive();
                if (_this.nav.canGoBack()) {
                    _this.nav.pop();
                }
                else if (view.component.name != "DiscoverPage") {
                    _this.nav.setRoot(DiscoverPage);
                }
                else {
                    _this.backgroundMode.moveToBackground();
                }
            });
            // Okay, so the platform is ready and our plugins are available.
            // Here we can do any higher level native things you might need.
            _this.statusBar.styleBlackTranslucent();
            _this.splashScreen.hide();
        });
    };
    MyApp.prototype.pushsetup = function () {
        var _this = this;
        var options = {
            android: {
                senderID: '1056346035559'
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'true'
            },
            windows: {}
        };
        var pushObject = this.push.init(options);
        pushObject.on('notification').subscribe(function (notification) {
            if (notification.additionalData.foreground) {
                var toast = _this.toastCtrl.create({
                    message: notification.message,
                    duration: 3000,
                    position: 'top'
                });
                if (notification.message.indexOf("message") > -1) {
                    var name_1 = notification.message.split("has")[0].trim();
                    _this.events.publish("addUnread", { "name": name_1 });
                    var view = _this.nav.getActive();
                    console.log(view.component.name);
                    if (view.component.name != "ContactsPage" && view.component.name != "ChatPage") {
                        _this.unread++;
                        _this.hamburgerNotification = true;
                        toast.present();
                        _this.nativeAudio.play('message-received-front');
                    }
                }
                if (notification.message.indexOf("connection") > -1) {
                    _this.events.publish("refreshContacts");
                    toast.present();
                    _this.events.publish("unread");
                    // this.unreadNotification =true
                }
                if (notification.message.indexOf("scheduled") > -1) {
                    toast.present();
                    _this.events.publish("unread");
                    // this.unreadNotification =true
                }
                if (notification.message.indexOf("accepted") > -1) {
                    toast.present();
                    _this.events.publish("unread");
                    // this.unreadNotification =true
                }
            }
        });
        pushObject.on('registration').subscribe(function (registration) {
            //do whatever you want with the registration ID
            var key = { "key": registration.registrationId, "uid": _this.user.uid };
            _this.pushCall(key);
        });
        pushObject.on('error').subscribe(function (error) { return alert('Error with Push plugin' + error); });
    };
    MyApp.prototype.pushCall = function (key) {
        var _this = this;
        this.people.updatePushRegistration(key, function (response) {
            if (response.status === -1)
                _this.pushCall(key);
        });
    };
    MyApp.prototype.openPage = function (page) {
        var _this = this;
        if (page.title === 'Connections') {
            this.people.clearUnread(this.user.uid);
            this.unread = 0;
            this.hamburgerNotification = false;
        }
        if (page.title === 'Discover')
            this.otherPage = false;
        else
            this.otherPage = true;
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
        this.pages.forEach(function (tmpp, index) {
            if (tmpp.title === page.title)
                _this.pages[index].selected = true;
            else
                _this.pages[index].selected = false;
        });
        console.log(this.nav);
    };
    MyApp.prototype.showProfile = function () {
        this.nav.push(Profile);
    };
    MyApp.prototype.getClicked = function () {
        var toast = this.toastCtrl.create({
            message: 'Upload and crop component on this action. Trying out android native toast',
            duration: 3000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            // console.log('Dismissed toast');
        });
        toast.present();
    };
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html',
            providers: [PeopleService]
        }),
        __metadata("design:paramtypes", [AudioService, NativeAudio, BackgroundMode, LocalNotifications, CallService, LoginService, Events, CallModalTrigger, PeopleService, Platform, Push, StatusBar, SplashScreen, ToastController, Storage])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map