import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ProductProvider, Product } from '../../providers/product/product'
import { CategoryProvider } from '../../providers/category/category'
import { HomePage } from '../home/home';
import { ContactPage } from '../contact/contact';

@IonicPage()
@Component({
  selector: 'page-edit-product',
  templateUrl: 'edit-product.html',
})
export class EditProductPage {
  model: Product;
  categories: any[];

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private toast: ToastController, private productProvider: ProductProvider,
    private categoryProvider: CategoryProvider) {

    this.model = new Product();

    if (this.navParams.data.id) {
      this.productProvider.get(this.navParams.data.id)
        .then((result: any) => {
          this.model = result;
        })
    }
  }

  /**
   * Runs when the page has loaded
   */
  ionViewDidLoad() {
    this.categoryProvider.getAll()
      .then((result: any[]) => {
        this.categories = result;
      })
      .catch(() => {
        this.toast.create({ message: 'category error.', duration: 3000, position: 'botton' }).present();
      });
  }

  save() {
    this.saveProduct()
      .then(() => {
        this.toast.create({ message: 'Product enregistré.', duration: 3000, position: 'botton' }).present();
 this.navCtrl.push(HomePage); 
 
 })
 .then(() => {
  this.toast.create({ message: 'Product enregistré.', duration: 3000, position: 'botton' }).present();
this.navCtrl.push(ContactPage);  

})
 
      .catch(() => {
        this.toast.create({ message: 'Error enregistrer  product.', duration: 3000, position: 'botton' }).present();
      });
  }

  private saveProduct() {
    if (this.model.id) {
      return this.productProvider.update(this.model);
    } else {
      return this.productProvider.insert(this.model);
    }
  }

}