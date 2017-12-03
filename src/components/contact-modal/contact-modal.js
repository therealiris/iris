// long press for small contact modal
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
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ChatPage } from '../../pages';
import { CallService, ContactService } from '../../services';
var ContactModal = /** @class */ (function () {
    function ContactModal(viewCtrl, params, navCtrl, callService, contactService) {
        this.viewCtrl = viewCtrl;
        this.params = params;
        this.navCtrl = navCtrl;
        this.callService = callService;
        this.contactService = contactService;
        this.contact = null;
    }
    ContactModal.prototype.chat = function () {
        this.navCtrl.push(ChatPage, { chatId: this.contact.id }, { animate: true, direction: 'forward' });
        this.cancel();
    };
    ContactModal.prototype.call = function () {
        this.callService.triggerCall(this.contact.id);
        this.cancel();
    };
    ContactModal.prototype.cancel = function () {
        this.viewCtrl.dismiss();
    };
    ContactModal.prototype.ngOnInit = function () {
        this.contact = this.contactService.get(this.params.get('contact').id);
    };
    ContactModal = __decorate([
        Component({
            templateUrl: 'contact-modal.html',
            selector: 'modal-contact'
        }),
        __metadata("design:paramtypes", [ViewController, NavParams, NavController, CallService, ContactService])
    ], ContactModal);
    return ContactModal;
}());
export { ContactModal };
//# sourceMappingURL=contact-modal.js.map