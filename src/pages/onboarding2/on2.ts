import { Component } from '@angular/core';
import { NavController, NavParams,ViewController } from 'ionic-angular';


@Component({
  selector: 'on-two',
  templateUrl: 'on2.html'
})
export class OnboardingTwo {
  items : string[]
  searchQuery: string = '';
  selectedList: string[];
  filler : any
  filled : any
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.filled = {}
    this.selectedList = []
    // this.selectedList = this.navParams.data.list
    // this.filler = this.navParams.data.callback
    // this.selectedList.forEach(item=>{
    //   this.filled[item] = true
    // })
    this.initializeItems();
  }
  initializeItems() {
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
    ]
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  updateList(item, value){
    let check = value.checked
    if(!check)
      {
      let index = this.selectedList.indexOf(item)
      if(index!=-1)
      this.selectedList.splice(index,1)
    }
    else
      {
      if(this.selectedList.length<=2)
        this.selectedList.push(item)
      else{
          value.checked = false
          alert("You can select maximum three industries")
      }
    }
    
      // console.log(this.selectedList) 
    }
    passSkills(){
      this.viewCtrl.dismiss({"industryList":this.selectedList})
    }
}
