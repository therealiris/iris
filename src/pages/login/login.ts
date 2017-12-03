import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController,Events } from 'ionic-angular';
import { PeopleService } from '../../providers/people-service'
import { Storage } from '@ionic/storage';
import { DiscoverPage } from '../discover/discover'
import { UploadPic } from '../uploadPic/uploadPic'
import * as moment from 'moment';
import md5 from 'md5';
import { AndroidPermissions } from '@ionic-native/android-permissions';


@Component({
  selector: 'login',
  templateUrl: 'login.html',
  providers: [PeopleService]
})
export class LoginPage {
  phone: string;
  numberSent : boolean;
  otp : number;
  smses : any;
  otpField: any;
  appUser :any;
  countDownStopped : boolean;
  timer : string;
  constructor(private androidPermissions: AndroidPermissions,public events: Events,public navCtrl: NavController, public loadingCtrl: LoadingController,public navParams: NavParams, public people : PeopleService, public storage: Storage) {
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.WAKE_LOCK,this.androidPermissions.PERMISSION.MODIFY_PHONE_STATE,this.androidPermissions.PERMISSION.RECORD_AUDIO,this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION ]);

    this.numberSent = false;
    this.appUser = this.navParams.data
    
    
    // console.log(this.appUser)
  }
  sendNumber(){
    this.countDownStopped = false
    if(this.phone!=null&&this.phone.toString().length===10)
    {
      let loading = this.loadingCtrl.create({
            spinner:"crescent",
            content: 'Sending OTP to your phone..'
          });
        loading.present()
        // this.otp = 5555
        this.otp = Math.floor(1000 + Math.random() * 9000)
        this.people.sendOtp(this.phone, this.otp, (response)=>{
          if(null!=response){
            this.numberSent = true;
            loading.dismiss()
            let now = moment()
            let then = moment().add(59,'seconds')
            this.startCountDown(now,then)
          }
        })
      }
      else{
        alert("Please enter a valid phone number")
      }
  }
  validate(){
    let validationModal = this.loadingCtrl.create({
            spinner:"crescent",
            content: 'Validating OTP'
          });
    validationModal.present()
    setTimeout(()=>{
      validationModal.dismiss()
    
    if(this.otpField.toString().length>3)
    {
      let loading = this.loadingCtrl.create({
            spinner:"crescent",
            content: 'Configuring IRIS Account.'
          });
        loading.present()
        if(this.otpField.toString()===this.otp.toString()){
           setTimeout(()=>{
             loading.dismiss()
           },2000)
           this.appUser.uid = md5(this.phone)
           this.appUser.username = this.appUser.uid
           this.people.updateCurrentUser(this.appUser.uid,(response)=>{ 
            if(response.status===1){
              //if user already logged-in
              this.appUser = response.userObject
              this.storage.ready().then(()=>{
                this.storage.set('currentUser',JSON.stringify(this.appUser))
                this.events.publish('configureUser',{"userData":this.appUser})
                this.navCtrl.setRoot(DiscoverPage);
              })
            }
            else{
              this.navCtrl.setRoot(UploadPic, this.appUser, { animate: true, direction: 'forward' });
            }  
          })
        }
        else{
          alert("Invalid OTP")
          loading.dismiss()
        }
      }
      else{
        alert("Invalid OTP")
      }

      },1500)
  }
  startCountDown(now, then){
    let nowString = now.toString(), thenString = then.toString()
    if(nowString!=thenString){
      console.log(nowString,thenString)
      setTimeout(()=>{
        let diff = then - now
        let duration = moment.duration(diff, 'seconds');
        this.timer = moment.utc(diff).format("mm:ss").toString()
        then = moment(then).subtract(1,'second')
        this.startCountDown(now,then)
      },1000)  
    }
    else{
      this.countDownStopped = true
    }
  }
}
