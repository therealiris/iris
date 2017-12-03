import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { PeopleService } from '../../providers/people-service'
import { Storage } from '@ionic/storage';
import { DiscoverPage } from '../discover/discover'
@Component({
  selector: 'ranking',
  templateUrl: 'ranking.html',
  providers: [PeopleService]
})
export class Ranking {
  user : any;
  rankList : any;
  info: any;
  rates : number[];
  constructor(private ev:Events,public loadingCtrl:LoadingController,public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public people: PeopleService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.user = {"pictureUrl":""}
    this.info = {"score":0, "ranking":0}
    this.rates =[];
    let loading = this.loadingCtrl.create({
        spinner:"crescent",
        content: 'Loading rankings. Please give us a moment.'
      });
      loading.present()
    storage.ready().then(()=>{
      storage.get('currentUser').then((data)=>{
        if(data!=null)
          {
            console.log("here now filling profile", data)
            this.user = JSON.parse(data)
            this.people.ranking(this.user.uid,(rankings)=>{
              console.log(rankings)
              this.info = rankings.userInfo
              this.rankList = rankings.rankedList
              this.rankList.forEach(rank=>{
                this.rates.push(parseFloat(rank.rating))
              })
              loading.dismiss()
              // console.log(this.rates)
            })
        }
      })
    })
  }
  back(){
    this.ev.publish('backToRoot')
    this.navCtrl.setRoot(DiscoverPage)
  }
}
