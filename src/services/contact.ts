// manages contacts

import { Injectable, ApplicationRef } from '@angular/core';
import { SocketService } from './';
import { Events } from 'ionic-angular';
import { PeopleService } from '../providers/people-service'


@Injectable()

export class ContactService {
	contacts = []
	public user = null
	filter = []
	// manages contacts online status
	constructor(private people:PeopleService,private ref: ApplicationRef, public socket: SocketService, public events: Events) {

		// triggered when a contact comes online
		this.socket.on('online', contact => {
			contact.online = true;
			// console.log(contact)
			if(this.filter.indexOf(contact.username)>-1)
			this.setOnlineUsers([contact]);
		});

		// triggered when a contact goes offline
		this.socket.on('offline', contact => {
			contact.online = false;
			this.setOnlineUsers([contact]);
		});

		// triggered when we request new contacts
		this.socket.on('contacts', contacts => {
			console.log('Contacts: ', contacts)
			this.setOnlineUsers(contacts);
		});

		// triggered after a successfull login
		this.events.subscribe('user.login', data => {
			this.user = data.user;
			people.updateCurrentUser(this.user.username,(user=>{
				let unreads = user.userObject.unread
				people.getConnections(this.user.username,(data=>{
					this.contacts = []
					data.forEach(d=>{
						let newContactObject = {"id":d._id.toString(),"image":d.pictureUrl,"designation":d.designation,"name":d.fullName,"username":d.uid,"online":true,"unread":false}
						if(unreads.indexOf(newContactObject.id)>-1)
							newContactObject.unread = true
						this.contacts.push(newContactObject)
					})
				}))
				this.filter = data.userObject.connections
			}))
		});
		this.events.subscribe('refreshContacts', () => {
			console.log("refreshing contacts")
			people.updateCurrentUser(this.user.username,(user=>{
				let unreads = user.userObject.unread
				people.getConnections(this.user.username,(data=>{
					this.contacts = []
					data.forEach(d=>{
						let newContactObject = {"id":d._id.toString(),"image":d.pictureUrl,"designation":d.designation,"name":d.fullName,"username":d.uid,"online":true,"unread":false}
						if(unreads.indexOf(newContactObject.id)>-1)
							newContactObject.unread = true
						this.contacts.push(newContactObject)
					})
				}))
				this.filter = user.userObject.connections
			}))
		});
		this.events.subscribe("clearUnread",(data)=>{
			this.contacts.forEach(co=>{
				if(co.id===data.id)
					co.unread = false
			})
		})
		this.events.subscribe("addUnread",(data)=>{
			this.contacts.forEach((co,index)=>{
				if(data.id){

					if(co.id===data.id)
					{
						co.unread = true
					this.contacts.splice(index,1)
					this.contacts.unshift(co)
				}
				}
				if(data.name){
					if(co.name===data.name)
						{
							co.unread = true
							this.contacts.splice(index,1)
							this.contacts.unshift(co)
						}
				}
				
			})
		})

		// triggeres after a logout event
		// note: this does not break the socket connection
		this.events.subscribe('user.logout', () => {
			this.user = null;
		});
	}

	// set online users
	private setOnlineUsers(contacts) {
		console.log('SET ONLINE USERS',contacts, this.user);

		// i think this happens when user is notified that they are online and we havent recieved the login thing yet
		if (!this.user) {
			console.error('No user yet for contats');
			return;
		}

		for (var x in contacts) {
			if (contacts[x].id == this.user.id) {
				continue;
			}
			var add = true;
			for (var xx in this.contacts) {
				if (this.contacts[xx].id == contacts[x].id) {
					// dont overwirte fields with empty data
					for (var xxx in contacts[x]) {
						this.contacts[xx][xxx] = contacts[x][xxx];
					}
					add = false;
					break;
				}
			}
			if (add) {
				this.contacts.push(contacts[x]);
			}
		}
		this.contacts.sort(this.sortContacts);
		console.debug('Contacts: ', this.contacts)
		this.ref.tick();
	};

	// sort contacts by online and last message
	private sortContacts(a, b) {
		if (!a) {
			return -1;
		}
		if (!b) {
			return 1;
		}
		if (a.online > b.online) {
			return -1;
		}
		if (a.online < b.online) {
			return 1;
		}
		if (new Date(a.lastDate) > new Date(b.lastDate)) {
			return -1;
		}
		if (new Date(a.lastDate) < new Date(b.lastDate)) {
			return 1;
		}
		return 0;
	};

	// get a contact and its details
	public get(id) {
		if (id == this.user.id) {
			return this.user;
		}
		for (let contact of this.contacts) {
			if (contact.id == id) {
				// console.log("this is contact object",contact)
				return contact;
			}
		}
		return {
			id: id
		};
	}
}