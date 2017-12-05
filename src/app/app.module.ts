import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { DiscoverPage } from '../pages/discover/discover';
import { OnboardingOne } from '../pages/onboarding1/on1';
import { OnboardingTwo } from '../pages/onboarding2/on2';
import { OnboardingThree } from '../pages/onboarding3/on3';
import { sendRequest } from '../pages/sendRequest/sendRequest';
import { Connections } from '../pages/connections/connections';
import { NotificationPage } from '../pages/notification/notification';
import { IonicStorageModule } from '@ionic/storage';    
import { HttpModule } from '@angular/http';
import { FilterPage } from '../pages/filterPage/filter'
import { RatingModal } from '../pages/rating-modal/rating-modal'
import { Tutorial } from '../pages/tutorial/tutorial'
import { CalendarPage } from '../pages/calendar/calendar'
import { UserDetail } from '../pages/userDetail/userDetail'
import { Profile } from '../pages/profile/profile'
import { ViewProfile } from '../pages/viewProfile/viewProfile'
import { Ranking } from '../pages/ranking/ranking'
import { PlannerOne } from '../pages/planner1/plannerOne'
import { PlannerTwo } from '../pages/planner2/plannerTwo'
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Feedback } from '../pages/feedback/feedback';
import { LoginPage } from '../pages/login/login';
import { UploadPic } from '../pages/uploadPic/uploadPic';
import { EditPic } from '../pages/editPic/editPic';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Ionic2RatingModule } from 'ionic2-rating';
import { ChatsPage, ChatPage, AccountPage, ContactsPage } from '../pages';
import { PeopleService } from '../providers/people-service';
import { CallModal, ContactModal, UserImage, CallModalTrigger, ContactAddModal, KeyboardAttach } from '../components';
import { AttachmentService, AudioService, CallService, ChatService, ContactService, LoginService, SocketService, VideoService} from '../services';
import { MomentModule } from 'angular2-moment';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { BackgroundMode } from '@ionic-native/background-mode';
import { NativeAudio } from '@ionic-native/native-audio';
import { Calendar } from '@ionic-native/calendar';
import { FCM } from '@ionic-native/fcm';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '30636649'
  }
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    DiscoverPage,
    OnboardingOne,
    OnboardingTwo,
    OnboardingThree,
    sendRequest,
    Connections,
    ChatPage,
    NotificationPage,
    CalendarPage,
    PlannerOne,
    PlannerTwo,
    Profile,
    ViewProfile,
    Feedback,
    LoginPage,
    UploadPic,
    EditPic,
    ChatsPage,
    AccountPage,
    CallModal,
    ContactModal,
    UserImage,
    ContactsPage,
    ContactAddModal,
    KeyboardAttach,
    FilterPage,
    UserDetail,
    RatingModal, Ranking, Tutorial
  ],
  imports: [
    BrowserModule,
    Ionic2RatingModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    IonicStorageModule.forRoot(),
    HttpModule,
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    DiscoverPage,
    OnboardingOne,
    OnboardingTwo,
    OnboardingThree,
    sendRequest,
    Connections,
    NotificationPage,
    CalendarPage,
    PlannerOne,
    PlannerTwo,
    Profile,ViewProfile,
    Feedback,
    LoginPage,
    UploadPic,
    EditPic,
    ChatsPage,
    ChatPage,
    AccountPage,
    CallModal,
    ContactModal,
    UserImage,
    ContactsPage,
    ContactAddModal,
    FilterPage,
    UserDetail,
    RatingModal,Ranking, Tutorial

  ],
  providers: [
  Calendar,
  BackgroundMode,NativeAudio,
    PeopleService,
    AttachmentService, CallModalTrigger, LoginService, AudioService, SocketService, CallService, ContactService, VideoService, ChatService,
    StatusBar,
    SplashScreen,
    File,
    Transfer,
    Camera,
    FilePath,
    LocalNotifications,
    AndroidPermissions,   
    FCM, 
    {provide: ErrorHandler, useClass: IonicErrorHandler}
    
  ]
})
export class AppModule {}
