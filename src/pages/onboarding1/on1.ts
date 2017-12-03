import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController,ModalController, AlertController,Events } from 'ionic-angular';
import { OnboardingTwo } from '../onboarding2/on2';
import { OnboardingThree } from '../onboarding3/on3';
import { Storage } from '@ionic/storage';
import { PeopleService } from '../../providers/people-service'


@Component({
  selector: 'on-one',
  templateUrl: 'on1.html',
  providers: [PeopleService]
})
export class OnboardingOne {
  icons: string[];
  user: any;
  rangeVal : any;
  form:any;
  gender: string;
  fullName:string;
  dob:string;
  email:string;
  ent:boolean;
  pr:boolean;
  designation:string;
  currentWorkplace:string;
  industry:any[] = [];
  type:string[];
  skills: any[] = [];
  constructor( public events: Events, public alertCtrl: AlertController, public modalCtrl: ModalController,public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public people: PeopleService, public loadingCtrl: LoadingController) {
    
    this.form = 'on1'
    this.rangeVal = 0
    this.skills = []
    // this.user = {
    // "uid" : "", 
    // "email" : "", 
    // "pictureUrl" : "../assets/img/faces/sid.jpg",
    // "fullName":"",
    // "dob":"",
    // "gender":"",
    // "type":[],
    // "industry":[],
    // "designation":"",
    // "currentWorkplace":"",
    // "skills":[],
    // "connections" : [], 
    // "requested" : [], 
    // "requests" : [], 
    // "lastLoginLocation" : "", 
    // "chatId" : "",
    // "rating":0,
    // "ranking":0,
    // "score":0
    // }
    
    this.user = this.navParams.data
    // console.log(this.user)
    // If we navigated to this page, we will have an item available as a nav param

    // Let's populate this page with some filler content for funzies

  }
 checkType(data){

   // let me = this
   // data.forEach((skill)=>{
   //   me.industry.push({"skill":skill,"rating":0})
   // })
   if(this.pr&&this.ent)
     this.type = ["professional", "entrepreneur"]
   else if(this.pr&&!this.ent)
     this.type = ["professional"]
   else if(this.ent&&!this.pr)
     this.type= ["entrepreneur"]
   else
     this.type = []
   // console.log(data, this.pr, this.ent)

  }
  selectIndustry(){
    let industryModal = this.modalCtrl.create(OnboardingTwo,{'list':this.industry});
    // this.navCtrl.push(OnboardingTwo, {callback:this.fillIndustry})
    industryModal.present()
    industryModal.onDidDismiss(data => {
     this.industry = data.industryList
   });
  }
  selectSkills(){
    let skillsModal = this.modalCtrl.create(OnboardingThree);
    // this.navCtrl.push(OnboardingTwo, {callback:this.fillIndustry})
    skillsModal.present()
    skillsModal.onDidDismiss(data => {
      this.skills=[]
       data.skillsList.forEach(skill=>{
       this.skills.push({"skill":skill,rating:0})
     })
   });
  }
  itemTapped(event) {
    if(event.keyCode == 13)
    {
      if(this.skills.length<=2)
        {
          this.skills.push({skill:event.target.value,rating:0})
          event.target.value = ""
          // console.log(this.skills)
        }
      else alert("You can add a maximum of three skills")
    }
      
  }
  presentLoadingDefault(userData) {
    this.storage.set("discoverTutorial",true)
    this.storage.set("contactsTutorial",true)    
    this.storage.set("plannerTutorial",true)    
    let loading = this.loadingCtrl.create({
      spinner:"crescent",
      content: 'Accessing IRIS ecosystem..Please wait...'
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
      this.events.publish('configureUser',{"userData":userData})
      // window.location.reload()
    }, 1500);
    
  }
  removeHobby(index){
    console.log(index)
    this.skills.splice(index,1)
  }
  removeIndustry(index){
    // console.log(index)
    this.industry.splice(index,1)
  }
  noChange(e){
    if(this.form==='on1')
      e.value = 0
    if(this.form==='on2')
      e.value = 40
    if(this.form==='on3')
      e.value = 80
  }
  nextClick(){
    if(this.form==='on1')
    {
      if(this.fullName&&this.dob&&this.gender&&this.email){
        this.user.fullName = this.fullName
        this.user.dob = this.dob
        this.user.gender = this.gender
        this.user.email = this.email
        this.form = 'on2'
        this.rangeVal = 40
      }
      else
        alert("All fields are necessary for onboarding")

    }
    else if(this.form==='on2')
    {
      if(this.designation&&this.industry.length>0&&this.type.length>0&&this.currentWorkplace){
        this.user.designation = this.designation
        this.user.industry = this.industry
        this.user.type = this.type
        this.user.currentWorkplace = this.currentWorkplace
        this.form= 'on3' 
        this.rangeVal = 80 
      }
      else
        alert("All fields are necessary for onboarding")
    }
    else
      {
        if(this.skills.length>0){

            this.user.skills = this.skills
            this.rangeVal = 100
            this.presentTerms()
            // console.log(this.user)
            
          }
          else alert("Please add atleast one skill")
      }
  }
  presentTerms(){
    let alert = this.alertCtrl.create({
      title: 'Terms & Conditions',
      message: "In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Iris a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.Your Content must be your own and must not be invading any third-party’s rights. Iris reserves the right to remove any of Your Content from this Website at any time without notice.",
      buttons: [
        {
          text: 'Disagree',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.people.sendData(this.user,(response)=>{
              // console.log(response)
              this.storage.ready()
              .then(()=>{
                this.storage.set('currentUser',JSON.stringify(this.user))
                this.presentLoadingDefault(this.user)
              })
            })
          }
        }
      ]
    });
    alert.present();
  }
}
