import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { NavController, ToastController } from 'ionic-angular';
import {  Product, ProductProvider } from '../../providers/product/product';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  products: any[] = [];

  onlyInactives: boolean = false;
  isLoggedIn:boolean = false;
  users: any;

  constructor(private fb: Facebook,private navCtrl:NavController, private toast: ToastController, private productProvider: ProductProvider) {
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

  login() {

    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then(res => {
        if(res.status === "connected") {
          this.isLoggedIn = true;
          this.getUserDetail(res.authResponse.userID);
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  logout() {
    this.fb.logout()
      .then( res => this.isLoggedIn = false)
      .catch(e => console.log('Error logout from Facebook', e));
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
  
 
 ionViewDidEnter() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productProvider.getAll(!this.onlyInactives)
      .then((result: any[]) => {
        this.products = result;
      });
  }

  addProduct() {
    this.navCtrl.push('EditProductPage');
  }

  editProduct(id: number) {
    this.navCtrl.push('EditProductPage', { id: id });
  }

  removeProduct(product: Product) {
    this.productProvider.remove(product.id)
      .then(() => {
        // Removendo do array de produtos
        var index = this.products.indexOf(product);
        this.products.splice(index, 1);
        this.toast.create({ message: 'Product supprimé.', duration: 3000, position: 'botton' }).present();
      })
  }

}