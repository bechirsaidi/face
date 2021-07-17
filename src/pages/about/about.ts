import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { App, NavController } from 'ionic-angular';
import { ContactPage } from '../contact/contact';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  isLoggedIn:boolean = false;
  users: any;


  constructor(public navCtrl: NavController,public app: App,private fb: Facebook) {
    fb.getLoginStatus()
    .then(res => {
      console.log(res.status);
      if(res.status === "connect") {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    })
    .catch(e => console.log(e));



  }
  getUserDetail(userid) {
    this.fb.api("/"+userid+"/?fields=id,email,name,picture.width(720).height(720),gender",["public_profile"])
      .then(res => {
        console.log(res);
        this.users = res;
      })
      .catch(e => {
        console.log(e);
      });

    }
    co() {
      this.navCtrl.push(ContactPage);
    }
  }
  