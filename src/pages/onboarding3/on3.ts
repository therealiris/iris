import { Component } from '@angular/core';
import { NavController, NavParams,ViewController } from 'ionic-angular';


@Component({
  selector: 'on-three',
  templateUrl: 'on3.html'
})
export class OnboardingThree {
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
    // // this.filler = this.navParams.data.callback
    // this.selectedList.forEach(item=>{
    //   this.filled[item] = true
    // })
    this.initializeItems();
  }
  initializeItems() {
    this.items = ["Adobe Illustrator",
"Adobe InDesign",
"Adobe Photoshop",
"Advanced Microsoft Excel",
"Advanced SQL",
"Agile Software",
"Amazon Web Services (AWS)",
"Analytics",
"Android",
"Angular",
"APIs",
"Application and Server Monitoring Tools",
"Application Development",
"Automated Deployment",
"Azure",
"Big Data",
"Branded Content",
"Branding",
"Budget Management",
"Business Analytics",
"Business Intelligence",
"Business Intelligence Dashboards and Reports",
"Business Process Modeling",
"Career Guidance",
"Case analysis",
"CATWOE",
"Client Server",
"Cloud Applications",
"Cloud Based Development",
"Cloud Based Visualization",
"Cloud Computing",
"Cloud Maintenance Tasks",
"Cloud Management Tools",
"Cloud Platforms",
"Cloud Scalability",
"Cloud Services",
"Cloud Systems Administration",
"Code Management and Promotion Tools",
"Cohort analysis",
"Content Audits",
"Content Creation",
"Content Development",
"Content Distribution",
"Content Management Systems (CMS)",
"Content Optimization",
"Content Promotion",
"Content Strategy",
"Content Trends",
"Corel Draw",
"Corel Word Perfect",
"CouchDB",
"Create Flow Charts",
"Creating Algorithms",
"Creating Controls to Assure Accuracy of Data",
"Creative Strategies",
"Credit analysis",
"Customer Support",
"D3.js",
"Data Analytics",
"Data Architecture",
"Data Flow",
"Data Intelligence",
"Data Management",
"Data Manipulation",
"Data Mining",
"Data Modeling",
"Data Profiling",
"Data Science",
"Data Science Tools",
"Data Sets",
"Data Sychronizatoin",
"Data Visualization Tools",
"Data Warehouse",
"Data Wrangling",
"Database Administration",
"Database Audits",
"Database Impact Management",
"Database Management",
"Decision Trees",
"Deployment Automation Tools",
"Deployment of Cloud Services",
"Descriptive analysis",
"Design Principles",
"Design Prototypes",
"Designing Data Warehouses",
"Designing Enterprise-Level Reporting",
"Desktop Support",
"Diagnostics",
"Digital Content Strategy",
"Digital Marketing",
"Digital Strategy",
"ECL",
"Emerging Technologies",
"End User Support",
"FileMaker Pro",
"Financial analysis",
"Flare",
"Fortran",
"Fourier analysis",
"Front End Design",
"Fundamental analysis",
"Google Analytics",
"Google Trends",
"Google Visualization API",
"Graphic Design",
"Hadoop",
"HBase",
"Heptalysis",
"Hosting Virtualization Platforms",
"Hypotheses Testing",
"Information Architecture",
"Information Design",
"Integrated Technologies",
"Interaction Design",
"Interaction Flows",
"Ionic",
"J2EE",
"Java",
"Java and Java Framework Experience",
"Javascript",
"JavaScript Programming Experience",
"Linux",
"Maintain Database",
"Manage Project Lifecycle",
"MATLAB",
"Measure Product Functionality",
"Measure User Acceptance",
"Merge Databases ",
"Microsoft Access",
"Microsoft ASP.NET MVC,",
"Microsoft Excel",
"Microsoft Office",
"Microsoft Outlook",
"Microsoft PowerPoint",
"Microsoft Project",
"Microsoft Publisher",
"Microsoft Visio",
"Microsoft Word",
"Mining Social Media Data",
"Monitoring Data Quality",
"MOST",
"Multi-Data Source Queries",
"Multiway data analysis",
"MySQL",
"Native Advertising",
"Node",
"NoSQL",
"Office 365",
"Office for Android",
"Office for iPad",
"Office for iPhone",
"oglinear analysis",
"OneDrive",
"OneNote",
"OneOps",
"Optimizing User Experiences",
"Optimizing Website Performance",
"PaaS",
"Pacing analysis",
"Paid Search Campaign Management",
"Perl",
"PESTLE",
"Photoshop",
"PHP",
"Planning",
"Policy analysis",
"Predictive analytics ",
"Predictive modeling",
"Prescriptive analytics",
"Process Management",
"Product Development",
"Product Launch",
"Product Management",
"Product Pricing Framework",
"Product Support",
"Project Management",
"Project Tracking",
"Proto.io",
"Prototyping Methods",
"PT Modeler",
"Python ",
"Qualitative analysis",
"Quantitative analysis",
"R",
"Rackspace",
"Raphael.js",
"React",
"Relational Database",
"Reporting",
"Reporting Tool Software",
"Responsive Design",
"REST",
"Ruby on Rails",
"SaaS",
"Sales Forecasting",
"SAP Business Solutions Toolset",
"SAS ",
"Scala",
"SCRS",
"Search Engine Marketing (SEM)",
"Search Engine Optimization (SEO)",
"Search Engine Optimization Campaigns",
"Selenium",
"SEO Assessments",
"SEO Audits",
"SEO Reports",
"SEO Tools",
"Setup and Maintain Windows and Linux Servers",
"Shell Scripting",
"Sketch",
"Social Media Analytics",
"Social Media Management",
"Social Media Optimization (SMO)",
"Software Development",
"Software Engineering",
"Software Quality Assurance (QA)",
"SPSS",
"Stakeholders",
"Statistical Learning Models",
"Statistical Modeling",
"Storyboards",
"Strategic Planning",
"Tableau",
"Technical Services",
"Technical Support",
"Technical Writing",
"Testing",
"TestingWhiz",
"Touch Input Navigation",
"Tracking Trends and Emerging Developments in Big Data",
"Training",
"Trendcasting",
"Troubleshooting",
"UI / UX",
"Unix",
"User Experience Design",
"VMWare",
"Web Analytics",
"Web API Experience",
"Wireframes",
"Xen",
"XHTML",
"XML",
"XML and Webservices"]
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
          alert("You can select maximum three skills")
      }
    }
    
      // console.log(this.selectedList) 
    }
    passSkills(){
      this.viewCtrl.dismiss({"skillsList":this.selectedList})
    }
}
