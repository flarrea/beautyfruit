import { CartService }from 'src/app/services/cart.service';
import { Product, Order } from '../../models/cart';
import { Component, OnInit, NgZone } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';
import { FirestoreService }  from '../../services/firestore.service';

import { serverTimestamp} from 'firebase/firestore';

import { ConnectionStatus, Network } from '@capacitor/network';
import { PluginListenerHandle } from '@capacitor/core';

@Component({
  selector: 'app-cartview',
  templateUrl: './cartview.page.html',
  styleUrls: ['./cartview.page.scss'],
})
export class CartviewPage implements OnInit {

  networkListener: PluginListenerHandle | undefined;
  status: boolean | undefined;

  cart: Product[] = [];

  order: Order[] = [];

  myTotal: number = 0;

  _id: number = 0;

  constructor(
        private cartService:CartService,
        private modalCtrl: ModalController,
        private router: Router,
        private alertCtrl: AlertController,
        private database: FirestoreService,
        private interaction: InteractionService,
        private ngZone: NgZone) { }

  async ngOnInit() {
    this.cart = this.cartService.getCart();

    this.networkListener = await Network.addListener('networkStatusChange', status => {

      this.ngZone.run(() => {
        this.changeStatus(status);
      })
    });
    
      const status = await Network.getStatus();

      this.changeStatus(status);  
  }

  changeStatus(status: ConnectionStatus){
    //this.status = status?.connected;
    if (this.status = status?.connected){
    this.interaction.presentToast('You are OnLine')
    }else{
      this.interaction.presentToast('You are OffLine')
    }

  }

  decreaseCartItem(product) {
    this.cartService.decreaseProduct(product);
  }
 
  increaseCartItem(product) {
    this.cartService.addProduct(product);
  }
 
  removeCartItem(product) {
    this.cartService.removeProduct(product);
  }
 
  getTotal() {
    this.myTotal = this.cart.reduce((i, j) => i + j.price * j.qty, 0);
    return this.myTotal;  
  }
 
  close() {
    this.modalCtrl.dismiss();
  }

  cardDetails() {

    this.close();
    
    this.cartService.restartCartItemCount();

      if (this.cart.length > 0) {

    this.order = new Array();

    for(var i=0 ; i<this.cart.length ; i++){

      var item = {

              id: this.cart[i].id,
              name: this.cart[i].name,
              price: this.cart[i].price,
              //description: this.cart[i].description,
              //image:this.cart[i].image,
              qty: this.cart[i].qty,
              //_id:' ',
              timestamp: serverTimestamp()
              //timestamp: serverTimestamp()
            }

      this.order.push(item);
      
     }

    const initialValue = {};

    const reducer = function( accumulator, element, index ) {
        return {
          ...accumulator,
          [ element.name ]: element //Puede ser id o name, de los ojetos que se venden
        }
    }

   const result: Order =this.order.reduce( reducer, initialValue );

   this.interaction.presentLoading('Saving...')

   const path = 'Orders'

   const id = this.database.getId();

   const timestamp = serverTimestamp();

   result.id = id;

   const _id = id;

   result.timestamp = timestamp;

   this.database.createDoc(result, path, id).then( () => {

     this.interaction.closeLoading();
     this.interaction.presentToast('Saved successfully')

      })

      this.router.navigate(['/payments', {total:this.myTotal, my_ID:_id}]);

    }else{

      this.cartService.restartCartItemCount();

      this.interaction.presentToast('Empty record')

      this.router.navigate(['tabs/products']);
    }

  }

  cleanShopCart(){


    this.cartService.restartCartItemCount();

  }

}
