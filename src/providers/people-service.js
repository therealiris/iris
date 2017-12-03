var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
/*
  Generated class for the PeopleService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.

*/
var apiUrl = "http://139.162.5.76:9003";
var PeopleService = /** @class */ (function () {
    function PeopleService(http) {
        this.http = http;
        console.log('Hello PeopleService Provider');
    }
    PeopleService.prototype.clearGeneral = function (uid, callback) {
        this.http.get(apiUrl + '/users/clearGeneralNotifications?uid=' + uid).map(function (response) { return response.json(); })
            .subscribe(function (response) {
            console.log(response);
            callback(response);
        });
    };
    PeopleService.prototype.ranking = function (uid, callback) {
        this.http.get(apiUrl + '/users/rankings?uid=' + uid)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            console.log(response);
            callback(response);
        });
    };
    PeopleService.prototype.pushRating = function (pointsBody, callback) {
        this.http.post(apiUrl + '/users/pushRating', pointsBody)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            console.log(response);
            callback(response);
        });
    };
    PeopleService.prototype.pushPendingRating = function (pointsBody, callback) {
        this.http.post(apiUrl + '/users/pushPendingRating', pointsBody)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            console.log(response);
            callback(response);
        });
    };
    PeopleService.prototype.addFeedback = function (feedBody, callback) {
        this.http.post(apiUrl + '/users/addFeedback', feedBody)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            console.log(response);
            callback(response);
        });
    };
    PeopleService.prototype.userById = function (id, callback) {
        this.http.get(apiUrl + '/users/userById?id=' + id)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            console.log(response);
            callback(response);
        });
    };
    PeopleService.prototype.clearUnread = function (uid) {
        this.http.post(apiUrl + '/users/clearUnread?uid=' + uid, {})
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            console.log(response);
        });
    };
    PeopleService.prototype.sendData = function (userObject, callback) {
        this.http.post(apiUrl + '/users/data', userObject)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            console.log(response);
            callback(response);
        });
    };
    PeopleService.prototype.discover = function (uid, filter, callback) {
        if (filter) {
            this.http.post(apiUrl + '/users/filterDiscover?uid=' + uid, filter)
                .map(function (response) { return response.json(); })
                .subscribe(function (response) {
                console.log(response);
                callback(response);
            });
        }
        else {
            this.http.get(apiUrl + '/users/discover?uid=' + uid)
                .map(function (response) { return response.json(); })
                .subscribe(function (response) {
                console.log(response);
                callback(response);
            });
        }
    };
    PeopleService.prototype.sendRequest = function (sender, sendee, reason, callback) {
        var requestObject = {
            "uid": sender.uid,
            "id": sendee,
            "fullName": sender.fullName,
            "pictureUrl": sender.pictureUrl,
            "headline": sender.designation + " at " + sender.currentWorkplace,
            "reason": reason
        };
        this.http.put(apiUrl + '/users/request', requestObject)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            console.log(response);
            callback(response);
        });
    };
    PeopleService.prototype.updateCurrentUser = function (uid, callback) {
        this.http.get(apiUrl + '/users/user?uid=' + uid)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            console.log(response);
            callback(response);
        });
    };
    PeopleService.prototype.getNotifications = function (uid, callback) {
        this.http.get(apiUrl + '/users/notifications?uid=' + uid)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            callback(response);
        });
    };
    PeopleService.prototype.acceptConnect = function (uid, acceptId, callback) {
        var acceptObject = { "uid": uid, "acceptId": acceptId };
        this.http.post(apiUrl + '/users/acceptConnect', acceptObject)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            console.log(response);
            callback(response);
        });
    };
    PeopleService.prototype.rejectConnect = function (uid, rejectId, callback) {
        var rejectObject = { "uid": uid, "rejectId": rejectId };
        this.http.post(apiUrl + '/users/rejectConnect', rejectObject)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            console.log(response);
            callback(response);
        });
    };
    PeopleService.prototype.acceptMeeting = function (acceptObject, callback) {
        this.http.post(apiUrl + '/users/acceptMeeting', acceptObject)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            console.log(response);
            callback(response);
        });
    };
    PeopleService.prototype.rejectMeeting = function (rejectObject, callback) {
        this.http.post(apiUrl + '/users/rejectMeeting', rejectObject)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            console.log(response);
            callback(response);
        });
    };
    PeopleService.prototype.getConnections = function (uid, callback) {
        this.http.get(apiUrl + '/users/connections?uid=' + uid)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            callback(response);
        });
    };
    PeopleService.prototype.getPendingConnections = function (uid, callback) {
        this.http.get(apiUrl + '/users/connections/pending?uid=' + uid)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            callback(response);
        });
    };
    PeopleService.prototype.updateLocation = function (uid, location, callback) {
        var updateObject = { "uid": uid, "location": location };
        this.http.put(apiUrl + '/users/updateLocation', updateObject)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            callback(response);
        });
    };
    PeopleService.prototype.updateChatId = function (uid, chatid, callback) {
        var updateObject = { "uid": uid, "chatid": chatid };
        this.http.put(apiUrl + '/users/chatId', updateObject)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            callback(response);
        });
    };
    PeopleService.prototype.getChatId = function (uid, callback) {
        this.http.get(apiUrl + '/users/chatId?uid=' + uid)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            callback(response);
        });
    };
    PeopleService.prototype.getEvents = function (uid, callback) {
        this.http.get(apiUrl + '/users/events?uid=' + uid)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            callback(response);
        });
    };
    PeopleService.prototype.pushEvent = function (meetingObject, callback) {
        this.http.post(apiUrl + '/users/events', meetingObject)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            console.log(response);
            callback(response);
        });
    };
    PeopleService.prototype.sendOtp = function (number, otp, callback) {
        this.http.get(apiUrl + '/users/otp?phone=' + number + '&otp=' + otp)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            callback(response);
        });
    };
    PeopleService.prototype.updatePushRegistration = function (key, callback) {
        this.http.post(apiUrl + '/users/updatePushRegistration', key)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            callback(response);
        });
    };
    PeopleService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http])
    ], PeopleService);
    return PeopleService;
}());
export { PeopleService };
//# sourceMappingURL=people-service.js.map