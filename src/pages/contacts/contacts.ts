// display list of contacts

import { Component } from '@angular/core';
import { NavController, ModalController,Events } from 'ionic-angular';
import { ChatPage, AccountPage, ChatsPage } from '../';
import { ContactModal } from '../../components';
import { LoginService, ContactService, ChatService } from '../../services';
import { Tutorial } from '../tutorial/tutorial'
import { DiscoverPage } from '../discover/discover'
import { PlannerTwo } from '../planner2/plannerTwo'
import { CalendarPage } from '../calendar/calendar'
import { ViewProfile } from '../viewProfile/viewProfile'
import { PeopleService } from '../../providers/people-service'
import { Storage } from '@ionic/storage';
import { ItemSliding } from 'ionic-angular';
@Component({
	selector: 'page-contacts',
	templateUrl: 'contacts.html'
})

export class ContactsPage {

contactList: any;
tutorial : boolean;
clicked : boolean;
connectionType:any;
pendingList:any;
	constructor(private storage:Storage,private people:PeopleService,public events:Events,private chatService: ChatService, private modalCtrl: ModalController, private navCtrl: NavController, private loginService: LoginService, public contactService: ContactService) {
		this.connectionType = "active"
		this.clicked = false
	    this.events.publish("clearHamNotification")
		this.events.publish("refreshContacts");
		this.contactList = contactService.contacts
		this.pendingList = []
		// console.debug('Contacts: ', contactService.contacts);
	    storage.get("currentUser").then(data=>{
	    	if(data!=null){
	    		let user = JSON.parse(data)
	    		this.people.getPendingConnections(user.uid,(pendingList)=>{
	    			this.pendingList = pendingList
	    			console.log(this.pendingList[0])
	    		})
	    	}
	    })
	}

	// tap and hold contact card
	contactCard(contact) {
		let modal = this.modalCtrl.create(ContactModal, {contact: contact});
		modal.present();
	}

	// go to accounts
	account() {
		this.navCtrl.push(AccountPage, {}, {animate: true, direction: 'forward'});
	}

	// go to a chat
	chat(id) {
		if(!this.clicked){
			this.clicked = true
		
		let name = "", designation= "", username = "" 
		this.contactList.forEach(con=>{
			if(con.id === id){
				name = con.name
				designation = con.designation
				username = con.username
				con.unread = false
			}
		})
		// item.close()
		
		console.log(id)
		this.chatService.getChatByContact(id).then((chat:any) => {
			this.clicked = false
			// console.debug('Pushing to chat: ', chat)

			this.navCtrl.push(ChatPage, {chatId: chat.id, "name":name,"designation":designation, "username":username}, {animate: true, direction: 'forward'});
		});
		}
	}

	goChats(id) {
		this.navCtrl.setRoot(ChatsPage, {}, {animate: true, direction: 'forward'});
	}
	goDiscover(){
		this.navCtrl.setRoot(DiscoverPage)
	}
	schedule(type){
    
    let planModal = this.modalCtrl.create(PlannerTwo,{
      "type": type
    });
    planModal.present()
    planModal.onDidDismiss(()=>{
      this.navCtrl.setRoot(ContactsPage)
    })
  }
  viewProfile(username){
  	console.log(username)
  	this.people.updateCurrentUser(username,(response)=>{
  		let viewUser = response.userObject
  		let viewUserModal = this.modalCtrl.create(ViewProfile,{"user":viewUser})
  		viewUserModal.present()
  	})
  }
  back(){
  	this.events.publish('backToRoot')
    this.navCtrl.setRoot(DiscoverPage)
  }

}