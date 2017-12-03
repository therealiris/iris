// handles incoming and outgoing text messages
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ApplicationRef, NgZone } from '@angular/core';
import { SocketService, ContactService } from './';
import { Events } from 'ionic-angular';
import * as marked from 'marked';
import { Storage } from '@ionic/storage';
var ChatService = /** @class */ (function () {
    // manages chats
    function ChatService(storage, zone, ref, socket, events, contactService) {
        var _this = this;
        this.storage = storage;
        this.zone = zone;
        this.ref = ref;
        this.socket = socket;
        this.events = events;
        this.contactService = contactService;
        this.user = null;
        this.chats = [];
        var evts = events;
        marked.setOptions({
            sanitize: true,
            gfm: true
        });
        storage.ready().then(function () {
            storage.get("currentUser").then(function (data) {
                _this.user = JSON.parse(data);
            });
        });
        // triggered after a successfull login
        //original method
        // this.events.subscribe('user.login', data => {
        // 	this.user = data.user;
        // });
        var self = this;
        // broadcast an event when there is a chat mesasage recieved
        // another way to do this would be to forward the message directly
        this.socket.on('chat-message', function (name, message) {
            console.log('SOCKET chat-message', name, message);
            evts.publish("addUnread", { "id": message.from });
            var have = false;
            for (var _i = 0, _a = self.chats; _i < _a.length; _i++) {
                var chat = _a[_i];
                if (message.chat == chat.id) {
                    have = true;
                    break;
                }
            }
            // get a new list of chats if we are missing something
            if (!have) {
                console.log('getting new chats...');
                self.socket.emit('chats');
            }
            self.updateLastMessage(message.chat, message);
            evts.publish('chat-message', name, message);
        });
        // triggered where there is an update to the chat data. like adding a user to the chat
        this.socket.on('chat', function (chat) {
            //zone.run(() => {
            console.debug('got a new chat update:', chat);
            for (var _i = 0, _a = _this.chats; _i < _a.length; _i++) {
                var c = _a[_i];
                if (c.id == chat.id) {
                    c.users = chat.users;
                    c.lastMessage = chat.lastMessage;
                    c.lastDate = chat.lastDate;
                    c.lastMarked = self.parseMessage(chat.lastMessage);
                    _this.processChats();
                    return;
                }
            }
            _this.chats.push(chat);
            _this.processChats();
            //});
        });
        this.socket.on('chats', function (chats) {
            zone.run(function () {
                console.debug('Chats: ', chats);
                // merge new chats to the chat array but dont replace the array itself
                for (var _i = 0, chats_1 = chats; _i < chats_1.length; _i++) {
                    var chat = chats_1[_i];
                    var i = true;
                    for (var _a = 0, _b = _this.chats; _a < _b.length; _a++) {
                        var c = _b[_a];
                        if (c.id == chat.id) {
                            i = false;
                            break;
                        }
                    }
                    if (i) {
                        _this.chats.push(chat);
                    }
                }
                for (var _c = 0, _d = _this.chats; _c < _d.length; _c++) {
                    var chat = _d[_c];
                    console.debug('CHAT', chat);
                    chat.lastMarked = _this.parseMessage(chat.lastMessage);
                }
                _this.processChats();
            });
        });
    }
    ChatService.prototype.parseMessage = function (message) {
        if (!message) {
            return null;
        }
        console.debug('parsing ', message);
        var m = marked.parse(message);
        m = m ? m.replace(/\<img.+\">/i, 'Image Attachment') : null;
        m = m.replace(/(<([^>]+)>)/ig, '');
        return m;
    };
    ChatService.prototype.processChats = function () {
        for (var _i = 0, _a = this.chats; _i < _a.length; _i++) {
            var chat = _a[_i];
            chat.name = this.chatName(chat);
        }
        this.chats.sort(this.sortChats);
        this.ref.tick();
    };
    // update the last message send for the chats view
    ChatService.prototype.updateLastMessage = function (id, message, date) {
        if (date === void 0) { date = new Date; }
        for (var c in this.chats) {
            var chat = this.chats[c];
            if (chat.id == id) {
                chat.lastMessage = message ? message.message : 'Attachment';
                chat.lastDate = date;
                chat.lastMarked = this.parseMessage(chat.lastMessage);
                break;
            }
        }
        this.chats.sort(this.sortChats);
    };
    ChatService.prototype.getChatById = function (id) {
        console.log(this.chats);
        for (var _i = 0, _a = this.chats; _i < _a.length; _i++) {
            var chat = _a[_i];
            if (chat.id == id) {
                return chat;
            }
        }
        return null;
    };
    ChatService.prototype.getChatByContact = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            for (var _i = 0, _a = _this.chats; _i < _a.length; _i++) {
                var chat = _a[_i];
                if (chat.users.length == 2 && chat.users.indexOf(_this.user.id) > -1 && chat.users.indexOf(id) > -1) {
                    resolve(chat);
                    return;
                }
            }
            console.log(_this.socket);
            _this.socket.promise('get-contact-chat', { id: id }).then(function (chat) {
                _this.chats.push(chat);
                _this.chats.sort(_this.sortChats);
                resolve(chat);
            });
        });
    };
    // sort cchats by last message
    ChatService.prototype.sortChats = function (a, b) {
        if (!a) {
            return -1;
        }
        if (!b) {
            return 1;
        }
        if (new Date(a.lastDate) > new Date(b.lastDate)) {
            return -1;
        }
        if (new Date(a.lastDate) < new Date(b.lastDate)) {
            return 1;
        }
        return 0;
    };
    ;
    ChatService.prototype.get = function (chatId) {
        var _this = this;
        var self = this;
        return new Promise(function (resolve, reject) {
            _this.socket.promise('chat', {
                chat: chatId
            }).then(function (data) {
                resolve(data);
            });
        });
    };
    ChatService.prototype.addContact = function (chat, contact) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.socket.promise('add-to-chat', { chat: chat.id, contact: contact.id }).then(function (chat) {
                resolve(chat);
            });
        });
    };
    ChatService.prototype.chatName = function (chat) {
        var name = '';
        for (var _i = 0, _a = chat.users; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c == this.user.id) {
                continue;
            }
            name += (name ? ', ' : '') + (this.contactService.get(c).name || this.contactService.get(c).username);
        }
        return name;
    };
    // send a new message to another contact
    ChatService.prototype.send = function (id, message, attachment) {
        console.debug('send chatid:', id);
        // @todo: make a promise so we know when it has fully been sent
        this.socket.emit('message', id, message, attachment);
    };
    // @todo: typing
    ChatService.prototype.typing = function () {
    };
    ChatService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Storage, NgZone, ApplicationRef, SocketService, Events, ContactService])
    ], ChatService);
    return ChatService;
}());
export { ChatService };
//# sourceMappingURL=chat.js.map