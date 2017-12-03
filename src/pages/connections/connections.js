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
import { NavController, NavParams } from 'ionic-angular';
import { PeopleService } from '../../providers/people-service';
import { Storage } from '@ionic/storage';
import { ChatPage } from "../chat/chat";
var Connections = /** @class */ (function () {
    function Connections(navCtrl, navParams, people, storage) {
        var _this = this;
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
                        _this.numberOfConnections = _this.connections.length;
                    });
                }
            });
        });
        // this.peer = new Peer("GYILtCA0OJ",{key: '8fli63luazrjatt9'});
        // this.peer.on('connection', function(conn) {
        //   conn.on('data', function(data) {
        //       alert(data);
        //     });
        // });
        // var conn = this.peer.connect("9h1bqduif36usor")
        // conn.on('open', function() {
        //     // Receive messages
        //     console.log(conn)
        //     setInterval(function(){
        //       conn.send('Hello!');
        //     },5000)
        //     conn.on('data', function(data) {
        //       console.log('Received', data);
        //     });
        //   });
        // people.getConnections('GYILtCA0OJ',(connects)=>{
        // 	this.connections = connects;
        // 	console.log(this.connections)
        // 	this.numberOfConnections = this.connections.length
        // }) 
    }
    Connections.prototype.createChat = function (index) {
        var toChat = this.connections[index];
        this.navCtrl.push(ChatPage, { "myId": this.user.uid, "connect": toChat });
    };
    Connections = __decorate([
        Component({
            selector: 'connections',
            templateUrl: 'connections.html',
            providers: [PeopleService]
        }),
        __metadata("design:paramtypes", [NavController, NavParams, PeopleService, Storage])
    ], Connections);
    return Connections;
}());
export { Connections };
//# sourceMappingURL=connections.js.map