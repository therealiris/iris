// manages contacts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ApplicationRef } from '@angular/core';
import { SocketService } from './';
import { Events } from 'ionic-angular';
import { PeopleService } from '../providers/people-service';
var ContactService = /** @class */ (function () {
    // manages contacts online status
    function ContactService(people, ref, socket, events) {
        var _this = this;
        this.people = people;
        this.ref = ref;
        this.socket = socket;
        this.events = events;
        this.contacts = [];
        this.user = null;
        this.filter = [];
        // triggered when a contact comes online
        this.socket.on('online', function (contact) {
            contact.online = true;
            // console.log(contact)
            if (_this.filter.indexOf(contact.username) > -1)
                _this.setOnlineUsers([contact]);
        });
        // triggered when a contact goes offline
        this.socket.on('offline', function (contact) {
            contact.online = false;
            _this.setOnlineUsers([contact]);
        });
        // triggered when we request new contacts
        this.socket.on('contacts', function (contacts) {
            console.log('Contacts: ', contacts);
            _this.setOnlineUsers(contacts);
        });
        // triggered after a successfull login
        this.events.subscribe('user.login', function (data) {
            _this.user = data.user;
            people.updateCurrentUser(_this.user.username, (function (user) {
                var unreads = user.userObject.unread;
                people.getConnections(_this.user.username, (function (data) {
                    _this.contacts = [];
                    data.forEach(function (d) {
                        var newContactObject = { "id": d._id.toString(), "image": d.pictureUrl, "designation": d.designation, "name": d.fullName, "username": d.uid, "online": true, "unread": false };
                        if (unreads.indexOf(newContactObject.id) > -1)
                            newContactObject.unread = true;
                        _this.contacts.push(newContactObject);
                    });
                }));
                _this.filter = data.userObject.connections;
            }));
        });
        this.events.subscribe('refreshContacts', function () {
            console.log("refreshing contacts");
            people.updateCurrentUser(_this.user.username, (function (user) {
                var unreads = user.userObject.unread;
                people.getConnections(_this.user.username, (function (data) {
                    _this.contacts = [];
                    data.forEach(function (d) {
                        var newContactObject = { "id": d._id.toString(), "image": d.pictureUrl, "designation": d.designation, "name": d.fullName, "username": d.uid, "online": true, "unread": false };
                        if (unreads.indexOf(newContactObject.id) > -1)
                            newContactObject.unread = true;
                        _this.contacts.push(newContactObject);
                    });
                }));
                _this.filter = user.userObject.connections;
            }));
        });
        this.events.subscribe("clearUnread", function (data) {
            _this.contacts.forEach(function (co) {
                if (co.id === data.id)
                    co.unread = false;
            });
        });
        this.events.subscribe("addUnread", function (data) {
            _this.contacts.forEach(function (co, index) {
                if (data.id) {
                    if (co.id === data.id) {
                        co.unread = true;
                        _this.contacts.splice(index, 1);
                        _this.contacts.unshift(co);
                    }
                }
                if (data.name) {
                    if (co.name === data.name) {
                        co.unread = true;
                        _this.contacts.splice(index, 1);
                        _this.contacts.unshift(co);
                    }
                }
            });
        });
        // triggeres after a logout event
        // note: this does not break the socket connection
        this.events.subscribe('user.logout', function () {
            _this.user = null;
        });
    }
    // set online users
    ContactService.prototype.setOnlineUsers = function (contacts) {
        console.log('SET ONLINE USERS', contacts, this.user);
        // i think this happens when user is notified that they are online and we havent recieved the login thing yet
        if (!this.user) {
            console.error('No user yet for contats');
            return;
        }
        for (var x in contacts) {
            if (contacts[x].id == this.user.id) {
                continue;
            }
            var add = true;
            for (var xx in this.contacts) {
                if (this.contacts[xx].id == contacts[x].id) {
                    // dont overwirte fields with empty data
                    for (var xxx in contacts[x]) {
                        this.contacts[xx][xxx] = contacts[x][xxx];
                    }
                    add = false;
                    break;
                }
            }
            if (add) {
                this.contacts.push(contacts[x]);
            }
        }
        this.contacts.sort(this.sortContacts);
        console.debug('Contacts: ', this.contacts);
        this.ref.tick();
    };
    ;
    // sort contacts by online and last message
    ContactService.prototype.sortContacts = function (a, b) {
        if (!a) {
            return -1;
        }
        if (!b) {
            return 1;
        }
        if (a.online > b.online) {
            return -1;
        }
        if (a.online < b.online) {
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
    // get a contact and its details
    ContactService.prototype.get = function (id) {
        if (id == this.user.id) {
            return this.user;
        }
        for (var _i = 0, _a = this.contacts; _i < _a.length; _i++) {
            var contact = _a[_i];
            if (contact.id == id) {
                // console.log("this is contact object",contact)
                return contact;
            }
        }
        return {
            id: id
        };
    };
    ContactService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [PeopleService, ApplicationRef, SocketService, Events])
    ], ContactService);
    return ContactService;
}());
export { ContactService };
//# sourceMappingURL=contact.js.map