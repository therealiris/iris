import { Component } from '@angular/core';
import { NavController, NavParams,Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PeopleService } from '../../providers/people-service'
import { DiscoverPage } from '../discover/discover'


@Component({
  selector: 'feedback',
  templateUrl: 'feedback.html',
  providers: [PeopleService]
})
export class Feedback {

	times : any;
	changes :any;
	beneficials :any;
	friends :any;
	motivation : any;
	anonymous : any;
	money: any;
  user :any;
  dummyrating:4;
  constructor(private ev: Events,public people : PeopleService,public storage: Storage,public navCtrl: NavController, public navParams: NavParams){
    this.dummyrating = 4
     storage.ready().then(()=>{
      storage.get('currentUser').then((data)=>{
        if(data!=null)
          {
            console.log("here now filling profile", data)
            this.user = JSON.parse(data)
        }
      })
    })
  }
  submitFeedback(){
    if(this.times && this.changes && this.beneficials && this.friends && this.motivation && this.anonymous){
      let feed = {"uid":this.user.uid,"times":this.times, "changes":this.changes, "beneficials":this.beneficials, "friends":this.friends,"motivation":this.motivation, "anonymous":this.anonymous,"money":this.money}
      this.people.addFeedback(feed,(status)=>{
        alert("Thank You for your valuable feedback. We have notified our team.")
        this.navCtrl.setRoot(DiscoverPage)
      })
      
    }
    else
      alert("Please fill in all questions")
  	
  	
  }
  back(){
    this.ev.publish('backToRoot')
    this.navCtrl.setRoot(DiscoverPage)
  }
}
