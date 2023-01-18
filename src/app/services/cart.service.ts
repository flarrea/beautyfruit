import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/cart';
import { BehaviorSubject } from 'rxjs';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public product: any;

  public Product: [];

  baseUrl = 'https://beauty-fruit-d10d5-default-rtdb.firebaseio.com/';

  private cart = [];

  private cartItemCount = new BehaviorSubject(0);

  constructor(private http: HttpClient) { }

  initialize() {
    this.getProducts().then(data => this.product = data);
  }

  restartCartItemCount() {
    this.cartItemCount.next(0);
  }

  getProducts() {
    let requestUrl = `${this.baseUrl}/products.json`;
    return this.http.get(requestUrl).toPromise();
  }

  getCart(){
    return this.cart;
  }

  getCartItemCount(){
    return this.cartItemCount;
  }

  addProduct(product) {
    let added = false;
    for (let p of this.cart) {
      if (p.id === product.id) {
        p.qty += 1;
        added = true;
        break;
      }
    }
    if (!added) {
      this.cart.push(product);
    }
    this.cartItemCount.next(this.cartItemCount.value + 1);
  }
 
  decreaseProduct(product) {

    for (let [index, p] of this.cart.entries()) {
      if (p.id === product.id) {
        p.qty -= 1;
        if (p.qty == 0) {
          this.cart.splice(index, 1);
        }
      }
    }
    this.cartItemCount.next(this.cartItemCount.value - 1);
    
  }
 
  removeProduct(product) {
    for (let [index, p] of this.cart.entries()) {
      if (p.id === product.id) {
        this.cartItemCount.next(this.cartItemCount.value - p.qty);
        this.cart.splice(index, 1);
      }
    }
  }

}
