// call modal display

import { Component, Input } from '@angular/core';
import { ModalController, NavParams, Events, ViewController} from 'ionic-angular';
import { CallService } from '../../services/call';
import { PeopleService } from '../../providers/people-service';
import { RatingModal } from '../../pages/rating-modal/rating-modal'
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';

declare var AudioToggle:any;

@Component({
	templateUrl: 'call-modal.html',
	selector: 'modal-call'
})
export class CallModal {
	audioSwitched:boolean;
	constructor(public localNotifications:LocalNotifications, public backgroundMode:BackgroundMode,private modalCtrl:ModalController,private people:PeopleService, params: NavParams, private events: Events, private viewCtrl: ViewController, public callService: CallService) {
		this.audioSwitched = false

		this.events.subscribe('call.trigger.hide', data => {
			this.hide();
		});
		// this.localNotifications.schedule({
  //         id: 1,
  //         title : 'Incoming Call',
  //         text: 'You are recieving a call. Tap to accept.',
  //         at: new Date(new Date().getTime() + 20)
  //       });
	}

	hide() {
		this.events.publish('call.status.isincall', false);
		this.callService.refreshVideos();
		this.viewCtrl.dismiss();
	}

	ngOnInit() {
		this.events.publish('call.status.isincall', true);
	}
	endCall(){

		console.log("end call called", this.callService.contact.id)
		this.people.userById(this.callService.contact.id.toString(),(user)=>{
	         let pendingRatingModal = this.modalCtrl.create(RatingModal,{"userObject":user,"alternate":true})
	        pendingRatingModal.present()
	        
	        this.callService.end()
	      })
		
	}
	switchAudio(){
		if(!this.audioSwitched)
		{	
			this.audioSwitched = true
			AudioToggle.setAudioMode(AudioToggle.SPEAKER);
		}
		else{
			this.audioSwitched = false
			AudioToggle.setAudioMode(AudioToggle.EARPIECE)
		}
	}
}