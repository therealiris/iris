// add contact to a chat modeal
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ModalController, ViewController } from 'ionic-angular';
import { ContactModal } from '../../components';
import { ContactService } from '../../services';
var ContactAddModal = /** @class */ (function () {
    function ContactAddModal(viewCtrl, modalCtrl, contactService) {
        this.viewCtrl = viewCtrl;
        this.modalCtrl = modalCtrl;
        this.contactService = contactService;
        this.contacts = [];
        this.contacts = contactService.contacts;
    }
    ContactAddModal.prototype.close = function () {
        this.viewCtrl.dismiss();
    };
    // tap and hold contact card
    ContactAddModal.prototype.contactCard = function (contact) {
        var modal = this.modalCtrl.create(ContactModal, { contact: contact });
        modal.present();
    };
    ContactAddModal.prototype.add = function (contact) {
        this.viewCtrl.dismiss(contact);
    };
    ContactAddModal = __decorate([
        Component({
            templateUrl: 'contact-add-modal.html',
            selector: 'modal-add-contact'
        }),
        __metadata("design:paramtypes", [ViewController, ModalController, ContactService])
    ], ContactAddModal);
    return ContactAddModal;
}());
export { ContactAddModal };
//# sourceMappingURL=contact-add-modal.js.map