import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { PeopleService } from '../../providers/people-service'
import { Storage } from '@ionic/storage';
import { Calendar } from '@ionic-native/calendar';

@Component({
  selector: 'userDetail',
  templateUrl: 'userDetail.html',
  providers: [PeopleService]
})
export class UserDetail {
  user : any;
  type : number;
  reasonHeading : string;
  reasonMessage : string;
  index : number;

  constructor(private calendar:Calendar,public viewCtrl:ViewController, public navCtrl: NavController, public navParams: NavParams, public people: PeopleService, public storage:Storage) {
    // If we navigated to this page, we will have an item available as a nav param
    this.user = this.navParams.get("user")
    this.type = this.navParams.get("type")
    this.index = this.navParams.get("index")
    console.log("user detail", this.user)
    if(this.type===1){
      let totalMessage = this.user.reason.split("||")
      this.reasonHeading = totalMessage[0]
      this.reasonMessage = totalMessage[1]
    }
    
  }
  acceptRequest(){
    this.viewCtrl.dismiss({"type":1,"status":true,"index":this.index})
  }
  rejectRequest(){
    this.viewCtrl.dismiss({"type":1,"status":false,"index":this.index})
  }
  acceptMeeting(){
    this.viewCtrl.dismiss({"type":2,"status":true,"index":this.index})
  }
  rejectMeeting(){
    this.viewCtrl.dismiss({"type":2,"status":false,"index":this.index})
  }
  justDismiss(){
    this.viewCtrl.dismiss()
  }
  openCalendar(){
    this.calendar.openCalendar(new Date(this.user.eventObject.from))
  }
}
