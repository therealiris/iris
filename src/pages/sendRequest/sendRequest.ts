import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { PeopleService } from '../../providers/people-service'
import { Storage } from '@ionic/storage';

@Component({
  selector: 'sendRequest',
  templateUrl: 'sendRequest.html',
  providers: [PeopleService]
})
export class sendRequest {
  selectedItem: any;
  icons: string[];
  item: any;
  showPoints : boolean;
  allow : boolean;
  reasons : any;
  reasonMessage :string;
  user : {"uid": string};
  constructor(public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams,public people: PeopleService,public storage:Storage) {
    // If we navigated to this page, we will have an item available as a nav param
    storage.ready().then(()=>{
      storage.get('currentUser').then((data)=>{
        if(data!=null)
          {
          this.user = JSON.parse(data)
        }
      })
    })
    // this.user = {"uid":'GYILtCA0OJ'}   //local testing
    this.selectedItem = navParams.get('item');
    this.showPoints = false
    this.allow = false
    this.item = this.navParams.data.item
  }

  enableConnect(){
    if(this.reasons.length>0)
      this.allow=true;
  }
  cancel(){
    this.viewCtrl.dismiss()
  }
  connect(){
    var reasonString = this.reasons + "||" + this.reasonMessage
    
    this.people.sendRequest(this.user,this.item.uid, reasonString,(res)=>{
      if(res.status==1)
        this.viewCtrl.dismiss({"justRequested":this.item.uid})
    })
  }
}
