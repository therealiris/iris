import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { PlannerTwo } from '../planner2/plannerTwo'
import { Storage } from '@ionic/storage';
import { PeopleService } from '../../providers/people-service'
import { Tutorial } from '../tutorial/tutorial'
import { Calendar } from '@ionic-native/calendar';
import { DiscoverPage } from '../discover/discover';
import { CallService } from '../../services';



@Component({
  selector: 'calendar',
  templateUrl: 'calendar.html',
  providers: [PeopleService]
})
export class CalendarPage {
  user: any;
  eventList : any;
  tutorial : boolean;
  constructor(private ev: Events,private callService: CallService,private calendar: Calendar,public modalCtrl:ModalController,public navCtrl: NavController, public navParams: NavParams, public people : PeopleService, public storage: Storage) {
    // If we navigated to this page, we will have an item available as a nav param
    this.eventList = []
    storage.get('plannerTutorial').then((val)=>{
      if(val)
      {
        let tut = this.modalCtrl.create(Tutorial,{"type":"calendar"})
        tut.present()
        tut.onDidDismiss(()=>{
          this.storage.set('plannerTutorial',false)
        })
      }
    });
    
    
    storage.ready().then(()=>{
      storage.get('currentUser').then((data)=>{
        if(data!=null)
          {
          	this.user = JSON.parse(data)
          	people.getEvents(this.user.uid,(events)=>{
          		events.forEach(event=>{
                let min = new Date(event.from), max = new Date(event.to),now = new Date()
                if(!(now>max)){
                  if(now>=min && now<=max)
                  {
                    if(!event.pending)
                    event["active"] = true
                    else
                    event["active"] = false  
                    this.eventList.push(event)
                    console.log(event)
                  }
                  else{
                    event["active"] = false
                    this.eventList.push(event)
                    console.log(event)
                  }
                }
                
              })
          	})
          }
      })
  })
   
  }
  schedule(type){
    
    let planModal = this.modalCtrl.create(PlannerTwo,{
      "type": type
    });
    planModal.present()
    planModal.onDidDismiss(()=>{
      this.navCtrl.setRoot(CalendarPage)
    })
  }
  syncItem(i){
    let eventObject = this.eventList[i],reminder = 15
    if(eventObject.type === 'meeting')
      reminder = 40

    this.calendar.createEventInteractivelyWithOptions(
            eventObject.type+" with "+ eventObject.with.fullName, 
            eventObject.venue, 
            eventObject.agenda, 
            new Date(eventObject.from), 
            new Date(eventObject.to),
            {"firstReminderMinutes":reminder})

  }
  call(i){
    this.callService.triggerCall(this.eventList[i].with.id)
  }
  back(){
    this.ev.publish('backToRoot')
    this.navCtrl.setRoot(DiscoverPage)

  }
}
