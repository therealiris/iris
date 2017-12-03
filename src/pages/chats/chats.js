var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, NgZone } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { ChatPage, AccountPage, ContactsPage } from '../';
import { LoginService, ChatService, ContactService } from '../../services';
var ChatsPage = /** @class */ (function () {
    function ChatsPage(contactService, zone, events, chatService, navCtrl, loginService) {
        var _this = this;
        this.contactService = contactService;
        this.zone = zone;
        this.events = events;
        this.chatService = chatService;
        this.navCtrl = navCtrl;
        this.loginService = loginService;
        // contacts / chats list state
        // loginService.complete.then(user => {
        // 	console.log("hello ji yeh hai ",user)
        // 	console.debug('login complete');
        // 	if (!user.id) {
        // 		loginService.go();
        // 	}
        // }, () => {
        // 	console.debug('login fail');
        // 	loginService.go();
        // });
        this.chatUsers = {};
        this.chatsList = chatService.chats.filter(function (c) {
            if (c.messages)
                return c;
        });
        this.chatsList.forEach(function (uniqueChat) {
            contactService.contacts.forEach(function (u) {
                if (uniqueChat.users.indexOf(u.id) > -1)
                    _this.chatUsers[uniqueChat.id] = u;
            });
        });
        events.publish("clearHamNotification");
    }
    // go to accounts
    ChatsPage.prototype.account = function () {
        this.navCtrl.push(AccountPage, {}, { animate: true, direction: 'forward' });
    };
    // go to a chat
    ChatsPage.prototype.chat = function (id) {
        this.navCtrl.push(ChatPage, { chatId: id }, { animate: true, direction: 'forward' });
    };
    ChatsPage.prototype.goContacts = function () {
        this.navCtrl.setRoot(ContactsPage, {}, { animate: true, direction: 'back' });
    };
    ChatsPage = __decorate([
        Component({
            selector: 'page-chats',
            templateUrl: 'chats.html'
        }),
        __metadata("design:paramtypes", [ContactService, NgZone, Events, ChatService, NavController, LoginService])
    ], ChatsPage);
    return ChatsPage;
}());
export { ChatsPage };
//# sourceMappingURL=chats.js.map