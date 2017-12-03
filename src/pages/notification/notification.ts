import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { PeopleService } from '../../providers/people-service'
import { UserDetail } from '../userDetail/userDetail'
import { DiscoverPage } from '../discover/discover'
import { Storage } from '@ionic/storage';
import { Calendar } from '@ionic-native/calendar';

@Component({
  selector: 'notification',
  templateUrl: 'notification.html',
  providers: [PeopleService]
})
export class NotificationPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  uid: string;
  notifications: any;
  notificationType : any;
  requests : any;
  meetings : any;
  general :any;
  constructor(private calendar:Calendar,public storage:Storage,public events: Events,public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams,public people: PeopleService) {
    // If we navigated to this page, we will have an item available as a nav param
    // let generalNotifications = this.storage.get("generalNotifications")
    // this.general = generalNotifications
    // console.log( generalNotifications)
    this.notificationType = "connections"
   	this.uid = this.navParams.data.uid
     if(this.navParams.data.segmentType)
       this.notificationType = this.navParams.data.segmentType
     this.requests = new Array();
     this.meetings = new Array();
     this.general = new Array();
     // this.uid = "758118e811e19b9ee236d467838a977a"
    this.people.getNotifications(this.uid,(response)=>{
      this.notifications = response.notifications
      this.notifications.forEach(notification=>{
        if(notification.type === 1)
          this.requests.push(notification)
        if(notification.type === 2)
          this.meetings.push( notification )
        if(notification.type === 0)
          this.general.push(notification)
      })
      if(this.requests.length<this.meetings.length)
        this.notificationType = "meetings"
      if(this.meetings.length<this.general.length)
        this.notificationType = "general"
      console.log(this.notifications)
    })

   	this.events.publish('clearNewNotification')
    this.events.subscribe("refreshNotifications",()=>{
      this.refreshNotification()
    }) 
  }

  refreshNotification(){
    this.people.getNotifications(this.uid,(response)=>{
      this.notifications = response.notifications
      this.notifications.forEach(notification=>{
        if(notification.type === 1)
          this.requests.push(notification)
        if(notification.type === 2)
          this.meetings.push( notification )
        if(notification.type === 0)
          this.general.push(notification)
      })
      if(this.requests.length<this.meetings.length)
        this.notificationType = "meetings"
      if(this.meetings.length<this.general.length)
        this.notificationType = "general"
      console.log(this.notifications)
    })
  }
  acceptConnect(index,acceptId){
    // let index = e.target.dataset.index
    // console.log(index)
    // let acceptId = e.target.dataset.uid
    this.people.acceptConnect(this.uid,acceptId,(response)=>{
      if(response.status==1)
        {
          this.requests.splice(index,1)
          this.events.publish("refreshContacts")
        }
    })
    
  }
  rejectConnect(index, rejectId){
    // let index = e.target.dataset.index
    // let rejectId = e.target.dataset.uid
    this.people.rejectConnect(this.uid,rejectId,(response)=>{
      if(response.status==1)
        this.requests.splice(index,1)
    })
  }
  acceptMeeting(index){
    // let index = e.target.dataset.index
    this.meetings[index].eventObject.pending = false
    let acceptObject = {"uid":this.uid,"eventObject":this.meetings[index].eventObject}
    console.log(acceptObject.eventObject)
    this.people.acceptMeeting(acceptObject,(response)=>{
      if(response.status==1)
        {
          this.meetings.splice(index,1)
          this.calendar.createEventWithOptions(
            acceptObject.eventObject.type+" with "+ acceptObject.eventObject.with.fullName, 
            acceptObject.eventObject.venue, 
            acceptObject.eventObject.agenda, 
            new Date(acceptObject.eventObject.from), 
            new Date(acceptObject.eventObject.to),
            {"firstReminderMinutes":5})
          .then((data)=>{
            console.log(data)
          })
        }

    })
  }
  rejectMeeting(index){
    // let index = e.target.dataset.index
    let rejectObject = {"uid":this.uid,"eventObject":this.meetings[index].eventObject}

    this.people.rejectMeeting(rejectObject,(response)=>{
      if(response.status==1)
        this.meetings.splice(index,1)
    })
  }

  //To be Done
  rescheduleMeeting(e){

  }
  showConnectionDetails(i){
    let userDetail = this.requests[i]
    console.log(userDetail)
    let modal = this.modalCtrl.create(UserDetail,{"user":userDetail,"type":1, "index":i})
    modal.present()
    modal.onDidDismiss((data)=>{
      if(data)
      {
        let response = data.status;
        let index = data.index;
        if(response)
          this.acceptConnect(index, this.requests[index].uid)
        else
          this.rejectConnect(index, this.requests[index].uid)
      }
    })
  }
  showMeetingDetails(i){
    let userDetail = this.meetings[i]
    console.log(userDetail)
    let modal = this.modalCtrl.create(UserDetail,{"user":userDetail,"type":2, "index":i})
    modal.present()
     modal.onDidDismiss((data)=>{
      if(data)
      {
        let response = data.status;
        let index = data.index;
        if(response)
          this.acceptMeeting(index)
        else
          this.rejectMeeting(index)
      }
    })
  }
  dismiss(){
    this.navCtrl.setRoot(DiscoverPage)
  }
  clearGeneral(){
    debugger;
    this.general = []
    this.people.clearGeneral(this.uid,(status)=>{
      console.log("clearing general notification")
    })
    
  }
}