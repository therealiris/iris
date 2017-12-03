import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController,ViewController } from 'ionic-angular';
import { PeopleService } from '../../providers/people-service'
import { Storage } from '@ionic/storage';
import  {OnboardingTwo} from '../onboarding2/on2'
import  {OnboardingThree} from '../onboarding3/on3'
import  {EditPic} from '../editPic/editPic'

@Component({
  selector: 'viewProfile',
  templateUrl: 'viewProfile.html',
  providers: [PeopleService]
})
export class ViewProfile {
  user : {pictureUrl:string, fullName:string, gender:string,email:string,designation:string,dob:string,currentWorkplace:string,hobbies:string[], industry:string[], skills:any};
  profile : any;
  fullName : string;
  gender : string;
  dob : string;
  email : string;
  hobbies : string[];
  designation : string;
  currentWorkplace : string;
  industry : string[];
  pictureUrl : string;
  skill : any;
  rate : any;
  editable:boolean;
  constructor(private viewCtrl:ViewController, public navParams: NavParams, public storage: Storage, public people: PeopleService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.editable = false;
    this.profile = "personal"
    this.user = this.navParams.get("user")
    console.log(this.user)
  }
   
  dismiss(){
    this.viewCtrl.dismiss()
  }
 
}

