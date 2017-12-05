import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { DiscoverPage } from '../pages/discover/discover';
import { CalendarPage } from '../pages/calendar/calendar';
import { Profile } from '../pages/profile/profile';
import { Ranking } from '../pages/ranking/ranking';
import { OnboardingOne } from '../pages/onboarding1/on1';
import { Feedback } from '../pages/feedback/feedback';
import { NotificationPage } from '../pages/notification/notification';
import { Storage } from '@ionic/storage';
import { PeopleService } from '../providers/people-service'
import { ContactsPage } from '../pages';
import { CallService, LoginService,AudioService } from '../services';
import { CallModalTrigger } from '../components';
import * as moment from 'moment';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';
import { NativeAudio } from '@ionic-native/native-audio';
import { FCM } from '@ionic-native/fcm';

declare var cordova:any;

@Component({
  templateUrl: 'app.html',
  providers: [PeopleService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  audio = [];
  volume = 1;
  rootPage: any ;
  user : any;
  pages: Array<{title: string, component: any , iconName : string, selected:boolean }>;
  isInCall = false;
  unread : number;
  unreadNotification : boolean;
  hamburgerNotification : boolean;
  otherPage : boolean;
  constructor(public audioService:AudioService,public nativeAudio:NativeAudio,private backgroundMode: BackgroundMode,public localNotifications:LocalNotifications,callService: CallService, private loginService: LoginService, public events: Events, callModal: CallModalTrigger,public people: PeopleService,public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private toastCtrl: ToastController, public storage:Storage,private fcm: FCM) {
    moment.locale('en', {
      relativeTime: {
        future: 'now',
        past: '%s',
        s: 'now',
        m: '1 m',
        mm: '%d m',
        h: '1 h',
        hh: '%d h',
        d: '1 d',
        dd: '%d d',
        M: '1 m',
        MM: '%d m',
        y: '1 y',
        yy: '%d y'
      }
    });


    fcm.getToken().then(token => {
      alert("Token : "+ token);
    })

    fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        //alert('received in background')
        
        let pageNumber= data.page;
        switch(pageNumber){
        case '1': alert("1"); break;
        case '2': alert("2");break;
        case '3': alert("3"); break;
        case '4': alert("4"); break;
        }
      } else {
        alert(JSON.stringify(data));
      };
    })

    fcm.onTokenRefresh().subscribe(token => {
      alert("token Refresh : "+token);
    })
    
    
    this.audioService.stopAudioCalling()
    this.hamburgerNotification = false
    this.unread = 0
    this.unreadNotification = false
    this.otherPage = false
    this.initializeApp();
    this.user = {fullName:'',pictureUrl:''}
    this.loginService.logout()
    storage.ready().then(()=>{
      storage.get('currentUser').then((data)=>{
        if(data!=null)
          {
          this.rootPage = DiscoverPage
          this.user = JSON.parse(data)
          //this.pushsetup();
          this.loginService.login({"username":this.user.uid,"password":"apptoken"}).then(() => {
            this.loginService.complete.then(user => {})
          }, data => {
              // console.log(data);
            });
        }
        else{
          this.rootPage = HomePage

          // this.loginService.login({"username":"c0668107c590e75bb5c5361c6347e9a9","password":"apptoken"}).then(() => {
          //   this.loginService.complete.then(user => {
          //   })
          // }, data => {
          //     console.log("1",data);
          //   });
          
          

        }
      })
    })
    
      
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Discover', component: DiscoverPage, iconName:'ios-search-outline', selected:false },
      { title: 'My Connections', component: ContactsPage, iconName:'ios-people-outline', selected:false  },
      { title: 'My Planner', component: CalendarPage, iconName:'ios-calendar-outline', selected:false  },
      { title: 'Ranking', component: Ranking, iconName:'ios-trophy-outline', selected:false  },
      { title: 'Feedback', component: Feedback, iconName:'ios-settings', selected:false  }

    ];
    events.subscribe('call.status.isincall', status => {
      if(this.backgroundMode.isActive()){
        this.backgroundMode.wakeUp()
        // this.backgroundMode.unlock()
        this.backgroundMode.moveToForeground();
      
      }
      else{
        this.backgroundMode.moveToForeground();
      }
        

      // console.debug('call status changed to ', status);
      this.isInCall = status;
    });
    events.subscribe('configureUser',(data)=>{
          if(data!=null)
          {   this.user = data.userData
              this.rootPage = DiscoverPage
              //this.pushsetup();
              this.loginService.login({"username":this.user.uid,"password":"apptoken"}).then(() => {
                this.loginService.complete.then(user => {})
                }, data => {
                    // console.log(data);
                  });
            }
    })
    events.subscribe('clearNewNotification',()=>{
      this.unreadNotification = false
    })
    events.subscribe('clearHamNotification',()=>{
      this.hamburgerNotification = false
      this.unread = 0
      this.people.clearUnread(this.user.uid)
    }) 
    events.subscribe('hamburgerOn',(data)=>{
      this.hamburgerNotification = true
      this.unread = data.num
    })
    events.subscribe('backToRoot',()=>{
      this.pages.forEach((pg,index)=>{
        if(pg.title === 'Discover')
          this.pages[index].selected = true
        else
          this.pages[index].selected = false
      })
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.backgroundMode.setDefaults({silent:true})
      this.backgroundMode.enable();
      this.platform.registerBackButtonAction(()=>{
        let view = this.nav.getActive();
        if(this.nav.canGoBack()){
              this.nav.pop();
            }
        else if(view.component.name!="DiscoverPage"){
          // this.pages.forEach((pg,index)=>{
          //   if(pg.title === 'Discover')
          //     this.pages[index].selected = true
          //   else
          //     this.pages[index].selected = false
          // })
          this.nav.setRoot(DiscoverPage)
        }
        else{
          this.backgroundMode.moveToBackground()
        }
      })
      // Okay, so the platform is ready and our plugins are available.
      // Here we can do any higher level native things you might need.
      this.statusBar.styleBlackTranslucent()

      this.splashScreen.hide();

      
      
    });
  }
  /*
  pushsetup() {

  const options: PushOptions = {  android: {senderID: '1056346035559'
     },     ios: {
         alert: 'true',
         badge: true,
         sound: 'true'},     windows: {}};
  const pushObject: PushObject = this.push.init(options);
  pushObject.on('notification').subscribe((notification: any) => {
    this.nav.push(NotificationPage)
    if (notification.additionalData.foreground) {
        this.events.publish("refreshNotifications")
        let toast = this.toastCtrl.create({
              message: notification.message,
              duration: 3000,
              position: 'top'
            });
        if(notification.message.indexOf("message")>-1)
        {
          let name = notification.message.split("has")[0].trim()
          this.events.publish("addUnread",{"name":name})
          let view = this.nav.getActive();
          console.log(view.component.name)
          if(view.component.name!="ContactsPage" && view.component.name!="ChatPage")
          {
            this.unread++
            this.hamburgerNotification=true
            toast.present()
            this.nativeAudio.play('message-received-front')
          }

          
        }
        if(notification.message.indexOf("connection")>-1)
        {
          this.events.publish("refreshContacts")
          toast.present();
          this.events.publish("unread")
          // this.unreadNotification =true
        }
        if(notification.message.indexOf("scheduled")>-1)
        {
          toast.present();
          this.events.publish("unread")
          // this.unreadNotification =true
        }
        if(notification.message.indexOf("accepted")>-1)
        {
          toast.present();
          this.events.publish("unread")
          // this.unreadNotification =true
        }
        
    }
      


  });
 
  pushObject.on('registration').subscribe((registration: any) => {
     //do whatever you want with the registration ID
     let key = {"key":registration.registrationId, "uid":this.user.uid}
     this.pushCall(key)

  });
 
  pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));

  }


  pushCall(key){
    this.people.updatePushRegistration(key,(response)=>{
       if(response.status===-1)
         this.pushCall(key);
     })
  }
  */
  openPage(page) {
    if(page.title==='Connections')
      {
        this.people.clearUnread(this.user.uid)
        this.unread = 0;
        this.hamburgerNotification = false
      }
    if(page.title === 'Discover')
      this.otherPage = false
    else
      this.otherPage = true
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
    this.pages.forEach((tmpp,index)=>{
      if(tmpp.title === page.title)
        this.pages[index].selected = true
      else
        this.pages[index].selected = false
    })
    console.log(this.nav)
  }
  showProfile(){
    this.nav.push(Profile)
  }

  getClicked(){
    let toast = this.toastCtrl.create({
      message: 'Upload and crop component on this action. Trying out android native toast',
      duration: 3000,
      position: 'top'
    });

  toast.onDidDismiss(() => {
    // console.log('Dismissed toast');
  });

  toast.present();
  }
}
