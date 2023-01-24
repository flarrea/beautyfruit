import { Component, ViewChild, ElementRef } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CartviewPage } from '../cartview/cartview.page';
import _ from 'lodash';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage {

  cart = [];
  products: any;
  product = null;

  cartItemCount: BehaviorSubject<number>;

  @ViewChild('cart', {static: false, read: ElementRef})fab: ElementRef;

  constructor(
    private cartService: CartService,
    private modalCtrl: ModalController,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.cartService.getProducts()
    .then(data=> this.products = data);
    this.cart = this.cartService.getCart();
    this.cartItemCount = this.cartService.getCartItemCount();
  }

  addToCart(product) {
    this.cartService.addProduct(product);
    console.log(typeof product);
    
    this.animateCSS('tada');
  }

  async openCart() {
    this.animateCSS('bounceOutLeft', true);
 
    let modal = await this.modalCtrl.create({
      component: CartviewPage,
      cssClass: 'cart-modal'
    });
    modal.onWillDismiss().then(() => {
      this.fab.nativeElement.classList.remove('animated', 'bounceOutLeft')
      this.animateCSS('bounceInLeft');
    });
    modal.present();
  }

  animateCSS(animationName, keepAnimated = false) {
    const node = this.fab.nativeElement;
    node.classList.add('animated', animationName)
    
    function handleAnimationEnd() {
      if (!keepAnimated) {
        node.classList.remove('animated', animationName);
      }
      node.removeEventListener('animationend', handleAnimationEnd)
    }
    node.addEventListener('animationend', handleAnimationEnd)
  }

    // User typed a search term into the Searchbar
    search(ev) {
    let searchText = ev.detail.value;
      // 1st filter by category & criteria
       this.products = _.filter(this.cartService.product);
      // 2nd filter by searchText (if not empty)
          if (searchText != '') {
            this.products = this.products.filter((product) => {
              return (product.name.toLowerCase()
                .indexOf(searchText.toLowerCase()) > -1);
            });
          }
       }


}
