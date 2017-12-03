// created to prevent circular dependencies on CallService and CallModal
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { ModalController, Events } from 'ionic-angular';
import { CallModal } from '../../components';
var CallModalTrigger = /** @class */ (function () {
    function CallModalTrigger(events, modalCtrl) {
        this.events = events;
        this.modalCtrl = modalCtrl;
        this.modal = null;
        var self = this;
        this.events.subscribe('call.trigger.show', function (data) {
            console.debug('SHOWING CALL FROM EVENT');
            self.call();
        });
    }
    CallModalTrigger.prototype.call = function () {
        this.modal = this.modalCtrl.create(CallModal);
        this.modal.present();
    };
    CallModalTrigger = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Events, ModalController])
    ], CallModalTrigger);
    return CallModalTrigger;
}());
export { CallModalTrigger };
//# sourceMappingURL=call-modal-trigger.js.map