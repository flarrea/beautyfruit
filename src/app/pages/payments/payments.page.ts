import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router'
import { InteractionService } from '../../services/interaction.service';
import { AlertController } from '@ionic/angular';
import { Observable, throwError } from 'rxjs';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Stripe } from '@ionic-native/stripe/ngx';

import { ActivatedRoute } from '@angular/router'

import { FirestoreService } from '../../services/firestore.service';

import { retry, catchError } from 'rxjs/operators';



@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {

  myID: string;

  StripeTokenID: string;

  email: string = "test@test.com";
  name: string = " John Dow";

  amount: any;
  currency: string = 'USD';
  currencyIcon: string = '$';

  cardInfo: any = {
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
  };

  purchaseID: string;

  constructor(private stripe: Stripe,
    private alertCtrl: AlertController,
    public http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public loadingController: LoadingController,
    private database: FirestoreService,
    private interaction: InteractionService) {
    this.amount = ((this.activatedRoute.snapshot.paramMap.get('total')));
    this.myID = ((this.activatedRoute.snapshot.paramMap.get('my_ID')));
  }

  ngOnInit() {
  }

  pay() {

    console.log(this.myID);

    this.stripe.setPublishableKey('pk_test_51HwPVhK62ac5yRiIJf0Zvff08TYVxAcSuyNyYKKrxy4V1gJHZ2Mwl6REj28mmSokGmBWn4GxcQfCZXpsdPbUWaWK00MLAoBe6J');

    this.stripe.createCardToken(this.cardInfo).then((token) => {

      this.interaction.presentLoading('Connecting...')

      console.log(token);

      const { id } = token;

      console.log(id);

      var purchaseID = id;

      this.StripeTokenID = purchaseID;

      console.log(this.StripeTokenID);

      console.log(this.myID);


      const headers = new HttpHeaders().set('Content-Type', 'application/json');

      let paydata = { stripeToken: token.id, amount: this.amount, currency: this.currency, name: this.name, email: this.email, myID: this.myID };


      let url = 'https://27cb-190-13-178-90.ngrok.io/charge';



      this.http.post(url, JSON.stringify(paydata), { headers: headers })
        .pipe(retry(1), catchError(this.handleError))
        .subscribe(
          {
            next: res => {

              this.interaction.closeLoading();
              this.interaction.presentToast('Successfully Connection')
              this.presentAlert();

            },
            error: err => {
              console.log(err.error);
              this.interaction.closeLoading();
              this.interaction.presentToast('Fail Connection Server')
              this.presentError();
            }
          });

    }).catch(error => {
      console.log(error);
      this.interaction.closeLoading();
      this.interaction.presentToast('Fail Connection Card Token')
      this.presentError();
    });

  };

  async presentAlert() {

    let alert = await this.alertCtrl.create({
      header: 'Order Success',
      message: 'We will deliver your order soon',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/success']);
          }
        }
      ]
    });
    alert.present();
  };

  async presentError() {
    let alert = await this.alertCtrl.create({
      header: 'Order Fail',
      message: 'We cant send the order',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/payments']);
          }
        }
      ]
    });
    alert.present();
  };

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading',
    });
    return await loading.present();
  }

  private handleError(error: HttpErrorResponse) {
    this.interaction.closeLoading();
    this.interaction.presentToast('Fail Connection')
    this.presentError();
    let errorMessage = 'Something bad happened; please try again later.';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      //errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      switch (error.status) {
        case 404: {
          return `Not Found: ${error.message}`;
        }
        case 403: {
          return `Access Denied: ${error.message}`;
        }
        case 500: {
          return `Internal Server Error: ${error.message}`;
        }
        default: {
          return `Unknown Server Error: ${error.message}`;
        }
      }

    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }


}