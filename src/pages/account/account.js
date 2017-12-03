// user account page
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
import { LoginService } from '../../services';
var AccountPage = /** @class */ (function () {
    function AccountPage(loginService) {
        this.loginService = loginService;
        this.user = null;
        this.user = this.loginService.user;
    }
    AccountPage.prototype.logout = function () {
        this.loginService.logout();
    };
    AccountPage = __decorate([
        Component({
            selector: 'page-account',
            templateUrl: 'account.html'
        }),
        __metadata("design:paramtypes", [LoginService])
    ], AccountPage);
    return AccountPage;
}());
export { AccountPage };
//# sourceMappingURL=account.js.map