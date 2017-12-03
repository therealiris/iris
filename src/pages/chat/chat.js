// chat detail page
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
import { NavParams, Content, Events, ModalController } from 'ionic-angular';
import { LoginService, ChatService, AudioService, ContactService, AttachmentService } from '../../services';
import { ContactAddModal } from '../../components';
import { Config } from '../../app/config';
import { DomSanitizer } from '@angular/platform-browser';
import { PeopleService } from '../../providers/people-service';
import { RatingModal } from '../rating-modal/rating-modal';
import * as marked from 'marked';
var ChatPage = /** @class */ (function () {
    function ChatPage(people, sanitizer, attachment, contactService, modalCtrl, events, params, loginService, chatService, audioService) {
        // console.debug('Viewing chat: ', params.get('chatId'));
        var _this = this;
        this.people = people;
        this.sanitizer = sanitizer;
        this.attachment = attachment;
        this.contactService = contactService;
        this.modalCtrl = modalCtrl;
        this.events = events;
        this.loginService = loginService;
        this.chatService = chatService;
        this.audioService = audioService;
        this.modal = null;
        this.animateChat = false;
        this.sending = false;
        this.messages = [];
        this.data = {
            message: null,
            attachment: null,
            attachmentData: null
        };
        this.chat = {
            id: null,
            users: [],
            name: '',
            messages: []
        };
        this.messageHandleWrap = null;
        this.attachments = Config.attachments;
        marked.setOptions({
            sanitize: true,
            gfm: true
        });
        this.chat = this.chatService.getChatById(params.get('chatId'));
        this.events.publish("clearUnread", { "id": params.get('chatId') });
        this.title = params.get('name') + ',' + params.get('designation');
        this.otherUserName = params.get('username');
        // if we refreshed on this page, then go back to chats
        if (!loginService.user) {
            loginService.go();
            return;
        }
        // get chat details
        this.chatService.get(params.get('chatId')).then(function (data) {
            console.log('Recieved chat messages: ', data);
            _this.chat.messages = data.messages;
            if (data && data.messages && data.messages.length) {
                data.messages.map(function (m) {
                    _this.addMessage(m);
                });
            }
            setTimeout(function () {
                _this.content.scrollToBottom(0);
            });
            setTimeout(function () {
                _this.content.scrollToBottom(0);
                _this.animateChat = true;
            }, 10);
        });
    }
    ChatPage.prototype.handleMessage = function (name, data) {
        var _this = this;
        console.log('new message: ', name, data);
        if (data.chat == this.chat.id) {
            this.addMessage(data);
            this.content.scrollToBottom(300);
            setTimeout(function () {
                _this.content.scrollToBottom(300);
                _this.animateChat = true;
            }, 100);
            this.audioService.play('message-received-front');
            console.log(this.messages.length);
            if (this.messages.length === 10 || this.messages.length === 60) {
                console.log("here tracking chat count");
                this.people.updateCurrentUser(this.otherUserName, function (user) {
                    var pendingRatingModal = _this.modalCtrl.create(RatingModal, { "userObject": user.userObject, "alternate": true });
                    pendingRatingModal.present();
                });
            }
        }
        else {
            this.audioService.play('message-received-back');
        }
    };
    ChatPage.prototype.addMessage = function (message) {
        this.messages.push(message);
        message.marked = message.message ? marked.parse(message.message) : null;
        var prev = null;
        for (var _i = 0, _a = this.messages; _i < _a.length; _i++) {
            var message_1 = _a[_i];
            if (message_1.from != prev) {
                prev = message_1.from;
                message_1.first = true;
            }
        }
    };
    // send a message
    ChatPage.prototype.send = function () {
        var _this = this;
        var check = this.data.attachmentData || (this.data.message && marked.parse(this.data.message));
        if (!check) {
            console.debug('No message to send: ', this.data.message);
            return;
        }
        this.sending = true;
        //this.blurInput(null);
        console.debug('Sending message ', this.data.message);
        this.audioService.play('message-sent');
        this.chatService.send(this.chat.id, this.data.message, this.data.attachmentData);
        this.addMessage({
            attachment: this.data.attachmentData,
            message: this.data.message,
            from: this.loginService.user.id
        });
        this.chatService.updateLastMessage(this.chat.id, this.data.message);
        this.data.message = null;
        this.data.attachmentData = null;
        this.data.attachment = '';
        setTimeout(function () {
            _this.content.scrollToBottom(300);
            _this.sending = false;
        }, 100);
    };
    ;
    // add a contact to the chat
    ChatPage.prototype.addContact = function () {
        var _this = this;
        var modal = this.modalCtrl.create(ContactAddModal);
        modal.onDidDismiss(function (data) {
            console.log(data);
            if (data) {
                _this.chatService.addContact(_this.chat, data);
            }
        });
        modal.present();
    };
    // keep the input focused.
    // for some reason it works best if this is separate from the send function
    ChatPage.prototype.blurInput = function (e) {
        //console.log(e);
        if (!this.sending) {
            return;
        }
        setTimeout(function () {
            $('#messageBox input').focus();
        }, 10);
        setTimeout(function () {
            $('#messageBox input').focus();
        }, 1);
        $('#messageBox input').focus();
    };
    ChatPage.prototype.ngOnInit = function () {
        var _this = this;
        // watch for incoming chat events and add it to the cleanup queue
        this.messageHandleWrap = function (a, b) {
            _this.handleMessage(a, b);
        };
        this.events.subscribe('chat-message', this.messageHandleWrap);
    };
    ChatPage.prototype.ngOnDestroy = function () {
        this.events.unsubscribe('chat-message', this.messageHandleWrap);
    };
    ChatPage.prototype.upload = function (e) {
        var _this = this;
        var file = e.target.files[0];
        this.attachment.upload({
            file: file,
            chat: this.chat
        }).then(function (res) {
            _this.data.message = null;
            _this.data.attachmentData = res;
            console.debug('Uploaded file: ', res);
            _this.send();
        });
        console.debug(file);
    };
    ChatPage.prototype.play = function (e) {
        e.target.currentTime = 0;
        e.target.play();
    };
    ChatPage.prototype.pause = function (e) {
        e.target.pause();
    };
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], ChatPage.prototype, "content", void 0);
    ChatPage = __decorate([
        Component({
            selector: 'page-chat',
            templateUrl: 'chat.html',
            providers: [PeopleService]
        }),
        __metadata("design:paramtypes", [PeopleService, DomSanitizer, AttachmentService, ContactService, ModalController, Events, NavParams, LoginService, ChatService, AudioService])
    ], ChatPage);
    return ChatPage;
}());
export { ChatPage };
//# sourceMappingURL=chat.js.map