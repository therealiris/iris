// chat detail page

import { Component, ViewChild } from '@angular/core';
import { NavParams, Content, Events, ModalController } from 'ionic-angular';
import { LoginService, ChatService, AudioService, ContactService, AttachmentService } from '../../services';
import { ContactAddModal } from '../../components';
import { Config } from '../../app/config';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { PeopleService } from '../../providers/people-service'
import { RatingModal } from '../rating-modal/rating-modal'

import * as marked from 'marked';

declare var document: any;
declare var $: any;

@Component({
	selector: 'page-chat',
	templateUrl: 'chat.html',
	providers: [PeopleService]
})
export class ChatPage {
	@ViewChild(Content) content: Content;

	modal = null
	animateChat = false
	sending = false
	messages = []
	data = {
		message: null,
		attachment: null,
		attachmentData: null
	}
	chat = {
		id: null,
		users: [],
		name: '',
		messages: []
	}
	otherUserName : String;
	messageHandleWrap = null
	attachments = Config.attachments;
	title :String;
	constructor(public people: PeopleService,private sanitizer: DomSanitizer, private attachment: AttachmentService, public contactService: ContactService, private modalCtrl: ModalController, private events: Events, params: NavParams, private loginService: LoginService, private chatService: ChatService, private audioService: AudioService) {
		// console.debug('Viewing chat: ', params.get('chatId'));

		marked.setOptions({
			sanitize: true,
			gfm: true
		});

		this.chat = this.chatService.getChatById(params.get('chatId'));
		this.events.publish("clearUnread",{"id":params.get('chatId')})
		this.title = params.get('name') +','+ params.get('designation')
		this.otherUserName = params.get('username')
		// if we refreshed on this page, then go back to chats
		if (!loginService.user) {
			loginService.go();
			return;
		}

		// get chat details
		this.chatService.get(params.get('chatId')).then((data: any) => {
			console.log('Recieved chat messages: ', data)
			this.chat.messages = data.messages;

			if (data && data.messages && data.messages.length) {
				data.messages.map(m => {
					this.addMessage(m);
				});
			}

			setTimeout(() => {
				this.content.scrollToBottom(0);
			});
			setTimeout(() => {
				this.content.scrollToBottom(0);
				this.animateChat = true;
			}, 10);
		});
	}

	private handleMessage(name, data) {
		console.log('new message: ', name, data)
		if (data.chat == this.chat.id) {
			this.addMessage(data);

			this.content.scrollToBottom(300);
			setTimeout(() => {
				this.content.scrollToBottom(300);
				this.animateChat = true;
			}, 100);
			this.audioService.play('message-received-front');
			console.log(this.messages.length)
			if(this.messages.length===10 || this.messages.length===60){
				console.log("here tracking chat count")
				this.people.updateCurrentUser(this.otherUserName,(user)=>{
					let pendingRatingModal = this.modalCtrl.create(RatingModal,{"userObject":user.userObject,"alternate":true})
	        		pendingRatingModal.present()
				})
			}
		} else {
			this.audioService.play('message-received-back');
		}
	}

	addMessage(message) {
		this.messages.push(message);
		message.marked = message.message ? marked.parse(message.message) : null;
		var prev = null;
		for (let message of this.messages) {
			if (message.from != prev) {
				prev = message.from;
				message.first = true;
			}
		}
		
	}

	// send a message
	send() {
		let check = this.data.attachmentData || (this.data.message && marked.parse(this.data.message));
		if (!check) {
			console.debug('No message to send: ', this.data.message);
			return;
		}

		this.sending = true;
		//this.blurInput(null);

		console.debug('Sending message ', this.data.message)
		this.audioService.play('message-sent');
		this.chatService.send(this.chat.id, this.data.message, this.data.attachmentData);

		this.addMessage({
			attachment: this.data.attachmentData,
			message: this.data.message,
			from: this.loginService.user.id
		});

		this.chatService.updateLastMessage(this.chat.id, this.data.message);
		this.data.message = null;
		this.data.attachmentData = null;
		this.data.attachment = '';

		setTimeout(() => {
			this.content.scrollToBottom(300);
			this.sending = false;
		}, 100)
	};

	// add a contact to the chat
	addContact() {
		let modal = this.modalCtrl.create(ContactAddModal);
		modal.onDidDismiss(data => {
			console.log(data);
			if (data) {
				this.chatService.addContact(this.chat, data);
			}
		});
		modal.present();
	}

	// keep the input focused.
	// for some reason it works best if this is separate from the send function
	blurInput(e) {
		//console.log(e);
		if (!this.sending) {
			return;
		}
		setTimeout(() => {
			$('#messageBox input').focus();
		}, 10);
		setTimeout(() => {
			$('#messageBox input').focus();
		}, 1);
		$('#messageBox input').focus();
	}

	ngOnInit() {
		// watch for incoming chat events and add it to the cleanup queue
		this.messageHandleWrap = (a, b) => {
			this.handleMessage(a,b);
		}
		this.events.subscribe('chat-message', this.messageHandleWrap);
	}

	ngOnDestroy() {
		this.events.unsubscribe('chat-message', this.messageHandleWrap);
	}

	upload(e:any) {
        let file = e.target.files[0];

		this.attachment.upload({
			file: file,
			chat: this.chat
		}).then(res => {
			this.data.message = null;
			this.data.attachmentData = res;
			console.debug('Uploaded file: ', res);
			this.send();
		});
        console.debug(file);
	}

	play(e:any) {
		e.target.currentTime = 0;
		e.target.play();
	}

	pause(e:any) {
		e.target.pause();
	}
}