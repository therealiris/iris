// display a user image, or set of user images
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { ContactService } from '../../services/contact';
var UserImage = /** @class */ (function () {
    function UserImage(contactService) {
        this.contactService = contactService;
        this.hideSelf = false;
        this.single = null;
        this.contacts = [];
    }
    UserImage.prototype.ngOnInit = function () {
        if (!this.contact) {
            return;
        }
        if (!(this.contact instanceof Array)) {
            this.contact = [this.contact];
        }
        for (var _i = 0, _a = this.contact; _i < _a.length; _i++) {
            var contact = _a[_i];
            var getContact = null;
            if (typeof contact == 'string') {
                getContact = this.contactService.get(contact);
                if (!getContact) {
                    continue;
                }
            }
            else {
                getContact = contact;
            }
            if (this.hideSelf && this.contactService.user.id == getContact.id) {
                continue;
            }
            if (getContact.image) {
                getContact.imagePath = getContact.image;
                // getContact.imagePath = 'assets/img/avatar/' + getContact.image;
            }
            this.contacts.push(getContact);
        }
        this.single = this.contacts.length > 1 ? 'multi' : 'single';
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], UserImage.prototype, "contact", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], UserImage.prototype, "hideSelf", void 0);
    UserImage = __decorate([
        Component({
            template: '<div class="user-image-container user-img-{{single}} user-img-count{{contacts.length}}"><img src="{{c.imagePath}}" class="user-img-{{single}}" *ngFor="let c of contacts"></div>',
            selector: 'user-image'
        }),
        __metadata("design:paramtypes", [ContactService])
    ], UserImage);
    return UserImage;
}());
export { UserImage };
//# sourceMappingURL=user-image.js.map