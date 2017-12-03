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
var OnboardingTwo = /** @class */ (function () {
    function OnboardingTwo(navCtrl, navParams, viewCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.searchQuery = '';
        // If we navigated to this page, we will have an item available as a nav param
        this.filled = {};
        this.selectedList = [];
        // this.selectedList = this.navParams.data.list
        // this.filler = this.navParams.data.callback
        // this.selectedList.forEach(item=>{
        //   this.filled[item] = true
        // })
        this.initializeItems();
    }
    OnboardingTwo.prototype.initializeItems = function () {
        this.items = [
            "Automotive",
            "Manufacturing",
            "Consulting",
            "Advisory Services",
            "Assurance Services",
            "Change and Sustainibility Services",
            "Taxation Services",
            "Transaction Services",
            "Corporate Banking",
            "Education & Training",
            "Food & Beverage",
            "Food Processing",
            "Information Technology",
            "Artificial Intelligence",
            "Computer Hardware",
            "Computer Software",
            "E-Commerce",
            "Game Development",
            "Graphic Designer",
            "Internet Services",
            "Management Information Systems (MIS)",
            "Mobile Applications",
            "Network and Security",
            "Technology Startup",
            "Telecom Equipment",
            "Testing and Quality Assurance",
            "UI Design",
            "UX Design",
            "Web Design",
            "Investment Banking",
            "Legal",
            "Media & Entertaintment",
            "Oil & Gas ",
            "Retail",
            "Consumer Packaged Goods (CPG)",
            "Jewelry",
            "Designer Wear",
            "Fashion and Apparel Wear",
            "Fast Moving Consumer Goods (FMCG)",
            "Retail Banking",
            "Telecom",
            "Human Resources",
            "Real Estate",
            "Architecture",
            "Building and Construction",
            "Interior Designer",
            "Medicine",
            "Pharmaceuticals",
            "Insurance",
            "Personal Finance"
        ];
    };
    OnboardingTwo.prototype.getItems = function (ev) {
        // Reset items back to all of the items
        this.initializeItems();
        // set val to the value of the searchbar
        var val = ev.target.value;
        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.items = this.items.filter(function (item) {
                return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
    };
    OnboardingTwo.prototype.updateList = function (item, value) {
        var check = value.checked;
        if (!check) {
            var index = this.selectedList.indexOf(item);
            if (index != -1)
                this.selectedList.splice(index, 1);
        }
        else {
            if (this.selectedList.length <= 2)
                this.selectedList.push(item);
            else {
                value.checked = false;
                alert("You can select maximum three industries");
            }
        }
        // console.log(this.selectedList) 
    };
    OnboardingTwo.prototype.passSkills = function () {
        this.viewCtrl.dismiss({ "industryList": this.selectedList });
    };
    OnboardingTwo = __decorate([
        Component({
            selector: 'on-two',
            templateUrl: 'on2.html'
        }),
        __metadata("design:paramtypes", [NavController, NavParams, ViewController])
    ], OnboardingTwo);
    return OnboardingTwo;
}());
export { OnboardingTwo };
//# sourceMappingURL=on2.js.map