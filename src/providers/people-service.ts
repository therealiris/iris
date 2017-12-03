import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the PeopleService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.

*/
const apiUrl = "http://139.162.5.76:9003"
@Injectable()
export class PeopleService {

  constructor(public http: Http) {
    console.log('Hello PeopleService Provider');
  }
  clearGeneral(uid,callback){
    this.http.get(apiUrl+'/users/clearGeneralNotifications?uid='+uid).map(response => response.json())
      .subscribe( response => {
       console.log(response)
       callback(response)  
      });
  }
  ranking(uid,callback){
    this.http.get(apiUrl+'/users/rankings?uid='+uid)
    .map(response => response.json())
      .subscribe( response => {
       console.log(response)
       callback(response)  
      });
  }
  pushRating(pointsBody,callback){
    this.http.post(apiUrl+'/users/pushRating',pointsBody)
    .map(response => response.json())
      .subscribe( response => {
       console.log(response)
       callback(response)  
      });
  }
  pushPendingRating(pointsBody,callback){
    this.http.post(apiUrl+'/users/pushPendingRating',pointsBody)
    .map(response => response.json())
      .subscribe( response => {
       console.log(response)
       callback(response)  
      });
  }
  addFeedback(feedBody,callback){
    this.http.post(apiUrl+'/users/addFeedback',feedBody)
    .map(response => response.json())
      .subscribe( response => {
       console.log(response)
       callback(response)  
      });
  }
  userById(id,callback){
    this.http.get(apiUrl+'/users/userById?id='+id)
    .map(response => response.json())
    .subscribe( response => {
     console.log(response)  
     callback(response);
    });
  }
  clearUnread(uid){
    this.http.post(apiUrl+'/users/clearUnread?uid='+uid,{})
    .map(response => response.json())
      .subscribe( response => {
       console.log(response)  
      });
  }
  sendData(userObject, callback){
  	this.http.post(apiUrl+'/users/data',userObject)  
  	.map(response => response.json())
    .subscribe( response => {
     console.log(response)	
     callback(response);
    });
  }

  discover(uid, filter, callback){
    if(filter){
      this.http.post(apiUrl+'/users/filterDiscover?uid='+uid, filter)
      .map(response => response.json())
      .subscribe( response => {
       console.log(response)  
       callback(response);
      });
    }
    else{
      this.http.get(apiUrl+'/users/discover?uid='+uid)
      .map(response => response.json())
      .subscribe( response => {
       console.log(response)  
       callback(response);
      });
    }
  	
  }

  sendRequest(sender, sendee, reason, callback){
    var requestObject = {
      "uid":sender.uid,
      "id":sendee,
      "fullName":sender.fullName,
      "pictureUrl":sender.pictureUrl,
      "headline":sender.designation +" at "+sender.currentWorkplace,
      "reason": reason
    }
    this.http.put(apiUrl+'/users/request',requestObject)
    .map(response => response.json())
    .subscribe( response => {
     console.log(response)  
     callback(response);
    });
  }
  updateCurrentUser(uid, callback){
    this.http.get(apiUrl+'/users/user?uid='+uid)
    .map(response => response.json())
    .subscribe( response => {
     console.log(response)  
     callback(response);
    });
  }
  getNotifications(uid, callback){
    this.http.get(apiUrl+'/users/notifications?uid='+uid)
    .map(response => response.json())
    .subscribe( response => { 
     callback(response);
    });
  }
  acceptConnect(uid,acceptId,callback){
    var acceptObject={"uid":uid,"acceptId":acceptId}
    this.http.post(apiUrl+'/users/acceptConnect',acceptObject)
    .map(response => response.json())
    .subscribe( response => {
     console.log(response)  
     callback(response);
    });
  }
  rejectConnect(uid,rejectId,callback){
    var rejectObject={"uid":uid,"rejectId":rejectId}
    this.http.post(apiUrl+'/users/rejectConnect',rejectObject)
    .map(response => response.json())
    .subscribe( response => {
     console.log(response)  
     callback(response);
    });
  }
  acceptMeeting(acceptObject,callback){
    this.http.post(apiUrl+'/users/acceptMeeting',acceptObject)
    .map(response => response.json())
    .subscribe( response => {
     console.log(response)  
     callback(response);
    });
  }
  rejectMeeting(rejectObject,callback){
    this.http.post(apiUrl+'/users/rejectMeeting',rejectObject)
    .map(response => response.json())
    .subscribe( response => {
     console.log(response)  
     callback(response);
    });
  }
  getConnections(uid,callback){
    this.http.get(apiUrl+'/users/connections?uid='+uid)
    .map(response => response.json())
    .subscribe( response => { 
     callback(response);
    });
  }
  getPendingConnections(uid,callback){
    this.http.get(apiUrl+'/users/connections/pending?uid='+uid)
    .map(response => response.json())
    .subscribe( response => { 
     callback(response);
    });
  }
  updateLocation(uid,location,callback){
    let updateObject = {"uid":uid,"location":location}
    this.http.put(apiUrl+'/users/updateLocation',updateObject)
    .map(response => response.json())
    .subscribe( response => { 
     callback(response);
    });
  }
  updateChatId(uid,chatid,callback){
    let updateObject = {"uid":uid,"chatid":chatid}
    this.http.put(apiUrl+'/users/chatId',updateObject)
    .map(response => response.json())
    .subscribe( response => { 
     callback(response);
    });
  }
  getChatId(uid,callback){
    this.http.get(apiUrl+'/users/chatId?uid='+uid)
    .map(response => response.json())
    .subscribe( response => { 
     callback(response);
    });
  }
  getEvents(uid,callback){
    this.http.get(apiUrl+'/users/events?uid='+uid)
    .map(response => response.json())
    .subscribe( response => { 
     callback(response);
    });
  }

  pushEvent(meetingObject,callback){
    this.http.post(apiUrl+'/users/events',meetingObject)
    .map(response => response.json())
    .subscribe( response => {
     console.log(response)  
     callback(response);
    });
  }
  sendOtp(number,otp,callback){
    this.http.get(apiUrl+'/users/otp?phone='+number+'&otp='+otp)
    .map(response => response.json())
    .subscribe( response => { 
     callback(response);
    });
  }
  updatePushRegistration(key,callback){
    this.http.post(apiUrl+'/users/updatePushRegistration',key)
    .map(response=>response.json())
    .subscribe(response=>{
      callback(response);
    })
  }
}
