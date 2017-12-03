import { Component,ViewChild } from '@angular/core';
import { NavController, LoadingController, Slides } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;  
  appUser:any;
  showLogin : boolean;
  constructor(public navCtrl: NavController, public storage: Storage, public loadingCtrl: LoadingController) {
      this.showLogin = false
    this.appUser = {
    "uid" : "",
    "username":"", 
    "email" : "", 
    "pictureUrl" : "",
    "image":"",
    "fullName":"",
    "dob":"",
    "gender":"",
    "type":[],
    "industry":[],
    "designation":"",
    "currentWorkplace":"",
    "skills":[],
    "connections" : [], 
    "requested" : [], 
    "requests" : [],
    "notifications":[],
    "events":[], 
    "lastLoginLocation" : "", 
    "chatId" : "",
    "pushId":"",
    "rating":0,
    "ranking":0,
    "score":0,
    "password":"",
    "pendingRatings":[],
    "unread":[]
    }
  }
  login(){
    this.navCtrl.push(LoginPage,this.appUser,{ animate: true, direction: 'forward' })
  }
  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log(currentIndex)
    if(currentIndex===2){
        this.showLogin = true;
        this.slides.lockSwipeToNext(true)

    }
    else{
        this.showLogin = false;
        this.slides.lockSwipeToNext(false)
    }
  }
}
