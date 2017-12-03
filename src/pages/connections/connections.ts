import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Nav, App, ViewController } from 'ionic-angular';
import { PeopleService } from '../../providers/people-service'
import { Storage } from '@ionic/storage';
import { ChatPage } from "../chat/chat"

@Component({
  selector: 'connections',
  templateUrl: 'connections.html',
  providers: [PeopleService]
})
export class Connections {
  connections : any;
  user : any;
  numberOfConnections : number;
  peer: any;
  id: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public people: PeopleService,public storage:Storage) {
    // If we navigated to this page, we will have an item available as a nav param
    storage.ready().then(()=>{
      storage.get('currentUser').then((data)=>{
        if(data!=null)
          {
            this.user = JSON.parse(data)
            people.getConnections(this.user.uid,(connections)=>{
            	this.connections = connections;
             this.numberOfConnections = this.connections.length
            })    
        }
      })
    })
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

  createChat(index){
    let toChat = this.connections[index]
    this.navCtrl.push(ChatPage,{"myId":this.user.uid,"connect":toChat})
  }

}
