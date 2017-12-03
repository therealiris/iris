import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'tutorial',
  templateUrl: 'tutorial.html'
})
export class Tutorial {
  type:string;

  constructor(private viewCtrl:ViewController,public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.type = this.navParams.get("type")
    
  }

dismiss(){
  this.viewCtrl.dismiss()
}
 
}
