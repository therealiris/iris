import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, Events } from 'ionic-angular';
import { sendRequest } from '../sendRequest/sendRequest'
import { FilterPage } from '../filterPage/filter'
import { NotificationPage } from '../notification/notification'
import { RatingModal } from '../rating-modal/rating-modal'
import { Tutorial } from '../tutorial/tutorial'
import { PeopleService } from '../../providers/people-service'
import { Storage } from '@ionic/storage';
import { Slides } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

@Component({
  selector: 'discover-list',
  templateUrl: 'discover.html',
  providers: [PeopleService]
})
export class DiscoverPage {
  @ViewChild(Slides) slides: Slides;
  selectedItem: any;
  icons: string[];
  items: any;
  showPoints : boolean;
  user:any;
  currentIndex: number;
  isConnected : boolean;
  isAds:boolean;
  lat: number;
  long: number;
  rate : number[];
  filter : any;
  pendingRatings:any;
  ratingCount:number;
  localRequested : any;
  tutorial : boolean;
  constructor(private events:Events,public modalCtrl:ModalController,public navCtrl: NavController,public loadingCtrl: LoadingController, public navParams: NavParams,public people: PeopleService,public storage:Storage) {
    this.user={"notifications":[""]}
    storage.get('discoverTutorial').then((val)=>{
      if(val)
      {
        let tut = this.modalCtrl.create(Tutorial,{"type":"discover"})
        tut.present()
        tut.onDidDismiss(()=>{
          this.storage.set('discoverTutorial',false)
        })
      }
    });
    
    this.currentIndex = 0
    this.rate = []
    this.pendingRatings = []
    this.localRequested = []
    this.ratingCount = 0
    // If we navigated to this page, we will have an item available as a nav param
    this.showPoints = false
    this.events.subscribe("unread",()=>{
      this.refresh()
    })
    // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO).then(
    //   success => {
    //     this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.RECORD_AUDIO)
    //     console.log("success")
    //      },
    //   err => this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.RECORD_AUDIO)
    // );
    storage.ready().then(()=>{
      storage.get('currentUser').then((data)=>{
        if(data!=null)
          {
            this.user = JSON.parse(data)
             people.updateCurrentUser(this.user.uid, (user)=>{
             this.user = user.userObject

             this.pendingRatings = user.userObject.pendingRatings

             if(user.userObject.unread.length>0)
               this.events.publish("hamburgerOn", {"num":user.userObject.unread.length})
             // console.log(this.pendingRatings)
             this.lat = this.user.lastLoginLocation.split(",")[0]
             this.long = this.user.lastLoginLocation.split(",")[1]
             this.startDiscover()
             this.locationUpdate()
             
           })
        }
      })
    })
    
  }
  showRatings(){
    // console.log("Pending Ratings Block")
    if(this.ratingCount<2)
    {
      let loading = this.loadingCtrl.create({
        spinner:"crescent",
        content: 'Loading pending ratings'
      });
      loading.present()
      this.people.updateCurrentUser(this.pendingRatings[this.ratingCount],(user)=>{
         let pendingRatingModal = this.modalCtrl.create(RatingModal,{"userObject":user.userObject,"alternate":false})
         loading.dismiss()
        pendingRatingModal.present()
        pendingRatingModal.onDidDismiss((data)=>{
          if(data.status)
          this.pendingRatings.splice(this.ratingCount,1)
        })
      })
      
    }
  }
  startDiscover(){
    
    let loading = this.loadingCtrl.create({
        spinner:"crescent",
        content: 'Loading profiles..'
      });
    loading.present()
    this.people.discover(this.user.uid, this.filter,(discoverList)=>{
        let filteredList = new Array()
        discoverList.forEach((listItem,index)=>{
          if(!(listItem.uid===this.user.uid||this.user.connections.indexOf(listItem.uid)>-1||this.user.requests.indexOf(listItem.uid)>-1||this.user.requested.indexOf(listItem.uid)>-1))
            {
              filteredList.push(listItem)
            }
        })
        this.items = filteredList
        for(var i=0;i<this.items.length;i++){
          if(!this.items[i].target){
            var totalRating = 0
            this.items[i].skills.forEach(skill=>{
              totalRating+=skill.rating
            })
            var avgRating = totalRating/this.items[i].skills.length
            this.rate.push(avgRating)
            var locationArr = this.items[i].lastLoginLocation.split(",")
            var distance = this.getDistanceFromLatLonInKm(this.lat,this.long, parseFloat(locationArr[0]),parseFloat(locationArr[1]))
            var numDist  = distance.toFixed(2)
            this.items[i].distance = numDist
          }
         
        }
        loading.dismiss();
        // this.locationUpdate()
        this.slides.lockSwipeToNext(false)
        this.slides.slideTo(0,500)
        // console.log(this.currentIndex)
      })
  }
  locationUpdate(){
    // console.log("updating location")
    Geolocation.getCurrentPosition().then(res => {
                // console.log(res.coords.latitude,res.coords.longitude)
        this.lat = res.coords.latitude
        this.long = res.coords.longitude  
        this.user.lastLoginLocation = this.lat+","+this.long

        this.people.updateLocation(this.user.uid,this.user.lastLoginLocation,(response)=>{
          // console.log("UPDATED LOGIN LOCATION")
          // this.showRatings()
        })
      }).catch((error) => {
        alert("error in locating")
      });
  }
  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
  var dLon = this.deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }
  slideChanged(){

    
      
      // this.showPoints = true

      // setTimeout(()=>{
      //   this.showPoints = false
      // },800)

      this.currentIndex = this.slides.getActiveIndex();
      if(this.items[this.currentIndex].target)
        this.isAds = true
      else
        this.isAds = false
      if(this.localRequested.indexOf(this.items[this.currentIndex]['uid'])>-1)
        this.isConnected=true
      else this.isConnected = false
      // console.log(this.currentIndex)
      if(this.currentIndex === this.items.length-1)
        this.slides.lockSwipeToNext(true)
      else
        this.slides.lockSwipeToNext(false)
      
    
  }
  connect(){
    let item = this.items[this.currentIndex]
    // console.log("hauchi")
    let connectModal = this.modalCtrl.create(sendRequest,{
      "item": item
    });
    connectModal.present()
    connectModal.onDidDismiss(data=>{
      if(data){
        this.localRequested.push(data.justRequested)
        this.isConnected = true
      }
      

    })
    // this.navCtrl.push(sendRequest, {
    //   item: item
    // });

  }
  openNotifications(){
    this.navCtrl.push(NotificationPage,{"uid":this.user.uid})
  }
  refresh(){
    this.people.updateCurrentUser(this.user.uid,(user)=>{
      this.user = user.userObject
    })
  }
  search(fab){
    let filterModal = this.modalCtrl.create(FilterPage,{"filter":this.filter});
    // this.navCtrl.push(OnboardingTwo, {callback:this.fillIndustry})
    filterModal.present()
    filterModal.onDidDismiss(data => {
      // console.log(data)

      this.filter = data.filter
      if(this.filter.type.length>0||this.filter.industry.length>0||this.filter.skills.length>0)
      {
        this.startDiscover()
        fab.close()
      }
      else{
        this.filter = undefined
        this.startDiscover()
      }

   });
  }
  clearFilter(fab){
    this.filter = undefined
    this.startDiscover()
    fab.close()
  }
}
