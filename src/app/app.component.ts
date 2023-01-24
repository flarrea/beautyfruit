import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { initializeApp } from 'firebase/app';

import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private cartService: CartService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.cartService.initialize();
    })
  }
}
