import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { PeopleService } from '../../providers/people-service'
import { Storage } from '@ionic/storage';
import  {OnboardingTwo} from '../onboarding2/on2'
import  {OnboardingThree} from '../onboarding3/on3'
import  {EditPic} from '../editPic/editPic'

@Component({
  selector: 'profile',
  templateUrl: 'profile.html',
  providers: [PeopleService]
})
export class Profile {
  user : {uid:string,pictureUrl:string, fullName:string, gender:string,email:string,designation:string,dob:string,currentWorkplace:string, industry:string[], skills:any};
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
  constructor( public modalCtrl:ModalController,public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public people: PeopleService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.editable = false;
    this.profile = "personal"
    this.user = {"uid":"","pictureUrl":"", "fullName":"", "gender":"","dob":"","email":"","designation":"","currentWorkplace":"","industry":[],"skills":[]}
    storage.ready().then(()=>{
      storage.get('currentUser').then((data)=>{
        if(data!=null)
          {
            console.log("here now filling profile", data)
            this.user = JSON.parse(data)
            this.people.updateCurrentUser(this.user.uid,(user)=>{
              this.user = user.userObject
              this.rate = this.user.skills
            })
        }
      })
    })
  }
   
  editMode(val){
    console.log("Editing profile" , val)
    this.editable = val
    if(!val){
      this.saveUserMod()
    }
  }
  modify(attr,val){
    this.user[attr] = val
  }
  saveUserMod(){
    this.people.sendData(this.user,(response)=>{
              // console.log(response)
      this.storage.ready()
      .then(()=>{
        this.storage.set('currentUser',JSON.stringify(this.user))

      })
    })
  }
  removeHobby(index){
    console.log(this.user.skills)
    this.user.skills.splice(index,1)
  }
  selectIndustry(){
    let industryModal = this.modalCtrl.create(OnboardingTwo,{'list':this.industry});
    // this.navCtrl.push(OnboardingTwo, {callback:this.fillIndustry})
    industryModal.present()
    industryModal.onDidDismiss(data => {
     this.user.industry = data.industryList
   });
  }
  removeIndustry(index){
    this.user.industry.splice(index,1)
  }
  selectSkills(){
    let skillsModal = this.modalCtrl.create(OnboardingThree);
    // this.navCtrl.push(OnboardingTwo, {callback:this.fillIndustry})
    skillsModal.present()
    skillsModal.onDidDismiss(data => {
      this.user.skills=[]
       data.skillsList.forEach(skill=>{
       this.user.skills.push({"skill":skill,rating:0})
     })
   });
  }
  uploadPic(){
    if(this.editable){
      let editPicModal = this.modalCtrl.create(EditPic,this.user);
      editPicModal.present()
    }
    
  }
 
}

