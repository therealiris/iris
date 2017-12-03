import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { OnboardingTwo } from '../onboarding2/on2';
import { OnboardingThree } from '../onboarding3/on3';
import { DiscoverPage } from '../discover/discover';


@Component({
  selector: 'filter-page',
  templateUrl: 'filter.html'
})
export class FilterPage {

industry:any[] = [];
type:string[];
skills: any[] = [];
pr: any;
ent: any;
constructor(public viewCtrl: ViewController,public modalCtrl:ModalController,public navCtrl: NavController, public navParams: NavParams) {
  this.type =[]
  let filterData = this.navParams.data.filter
  if(filterData){
    this.type = filterData.type
    this.industry = filterData.industry
    this.skills = filterData.skills
    if(this.type.indexOf("professional")>-1)
      this.pr =true
    if(this.type.indexOf("entrepreneur")>-1)
      this.ent = true
  }
}

checkType(){

  if(this.pr&&this.ent)
   this.type = ["professional", "entrepreneur"]
  else if(this.pr&&!this.ent)
   this.type = ["professional"]
  else if(this.ent&&!this.pr)
   this.type= ["entrepreneur"]
  else
   this.type = []

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
   data.skillsList.forEach(skill=>{
     this.skills.push({"skill":skill,rating:0})
   })
 });
}
removeHobby(index){
  console.log(index)
  this.skills.splice(index,1)
}
removeIndustry(index){
  // console.log(index)
  this.industry.splice(index,1)
}
passFilter(){
  this.viewCtrl.dismiss({"filter":{"industry":this.industry,"skills":this.skills,"type":this.type}})
}
back(){
  this.navCtrl.popToRoot()
}
}
