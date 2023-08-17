import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  IPayPalConfig,
  ICreateOrderRequest,
  PayPalScriptService,
  NgxPaypalComponent,
} from 'ngx-paypal';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ApiService } from '../../app/services/api.service';
import { config } from '../../app/services/config';
import { NotificationService } from '../../app/services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalFooService } from '../../app/services/globalFooService.service';
import { Subscription } from 'rxjs';
import { plans } from './plan';
import * as moment from 'moment';
declare var paypal;  
@Component({
  selector: 'app-support-us',
  templateUrl: './support-us.component.html',
  styleUrls: ['./support-us.component.scss'],
})
export class SupportUsComponent implements OnInit {
   @ViewChild('paypal', { static: true }) paypalElement: ElementRef;  
  private plans = [];
  public configs = {};
  @ViewChild('basic') basicSubscription?: NgxPaypalComponent;
  @ViewChild('advanced') advancedSubscription?: NgxPaypalComponent;
  @ViewChild('payPalElem1') paypalComponent1?:  NgxPaypalComponent;
    @ViewChild('payPalElem2') paypalComponent2?:  NgxPaypalComponent;
basicAuth = 'Basic QVd3TVNkQlVQMHltN25RdjJGV3M2OEFDRnpNVG51T2x3eGFHdmlkV1o1ODZ1STFBR1NiQTFyazVGc1JfV0dlQXE3XzRUVmx1WF9iSnd5dVk6RUpBZ2V1QW0xMy1xLTkwRjRMN0NWVmhUMUV3NjI4REM2M2U0TkdlWU14MUt6Z2VYaU5JeHNRLTVMSGJPUTRlTXBsOXAwQlNVLUV3Zk1NeWg=';  //Pass your ClientId + scret key
    // [{"key":"Authorization","value":"Basic QVd3TVNkQlVQMHltN25RdjJGV3M2OEFDRnpNVG51T2x3eGFHdmlkV1o1ODZ1STFBR1NiQTFyazVGc1JfV0dlQXE3XzRUVmx1WF9iSnd5dVk6RUpBZ2V1QW0xMy1xLTkwRjRMN0NWVmhUMUV3NjI4REM2M2U0TkdlWU14MUt6Z2VYaU5JeHNRLTVMSGJPUTRlTXBsOXAwQlNVLUV3Zk1NeWg=","description":""}]

  paymentHandler: any = null;
  stripeAPIKey: any =
    'pk_test_51LrfVxLTwCQPIkjJsYVyY8LBMZboiOGuSrzYrvqwSJmNNLHtnqRjP1jTmvZ2aNlG81dyJiPndukGM5JwKSV7vbKN00NuifshRZ';

  public payPalConfig?: IPayPalConfig;
  public supportUsForm: FormGroup;

  showSuccess: boolean = false;
  showCancel: boolean = false;
  showError: boolean = false;
  submitted: boolean = false;
  showPaypalCondtion: boolean = false;
  showPaypalbtn: boolean = false;
  showPaypalbtnmonthly: boolean = false;

  currency: string = 'USD';

  currencies: any = [];
  plansss: any = [];
  selected_currency: any;
  selected_currency_symbol: any;
  price: any = 5;
  user_id: any;
  paymentDetails: any;
  planDetail: any;
  subscription: Subscription;
  user_name: any;
  user_email: any;
  responseData: any;

  constructor(
    private payPalScriptService: PayPalScriptService,
    private http: HttpClient,
    private fb: FormBuilder,
    private SharedService: GlobalFooService,
    private spinner: NgxSpinnerService,
    private notifyService: NotificationService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    localStorage.setItem('currencycode', 'USD');
    this.plans = plans;

    this.selected_currency_symbol = '$';

    this.currencies = [
      { id: 1, name: 'USD', symbol: '$' },
      { id: 2, name: 'EUR', symbol: '€' },
      { id: 3, name: 'GBP', symbol: '£' },
      { id: 4, name: 'CAD', symbol: 'C$' },
      { id: 5, name: 'AUD', symbol: 'A$' },
    ];

    if (localStorage.getItem('is_logged_in') == 'true') {
      this.user_id = this.apiService.decryptData(
        localStorage.getItem('user_token'),
        config.ENC_SALT
      );
      this.getProfileDetail();
      this.subscription = this.SharedService.getObservable().subscribe(
        (res: any) => {
          this.user_id = this.apiService.decryptData(
            localStorage.getItem('user_token'),
            config.ENC_SALT
          );
          this.user_name = res.user_name;
        }
      );
    } else {
      this.user_id = '';
      localStorage.clear();
      // this.notifyService.showWarning('Please login to use this feature')
      // let currentUrl = this.router.navigateByUrl('/login');
    }

//     paypal.Buttons({
//   createOrder: function(data, actions) {
//     return actions.order.create({
//       purchase_units: [{
//         amount: {
//           value: localStorage.getItem('price') != 'null'
//                         ? localStorage.getItem('price')
//                         : localStorage.getItem('other_amount'),
//           currency_code: 'USD'
//         }
//       }]
//     });
//   },
//   //...
// }).render('#paypal');

     // this.initConfig();
  }

  usepaypal(){
    if(this.supportUsForm.value.payment_type == 'one_time'){
      this.initConfig();
    }
    else{
      console.log('monthlyddd');

      const frmData2 = new FormData();
      if (this.supportUsForm.value.other_amount) {
      frmData2.append('amount', this.supportUsForm.value.other_amount);
    } else {
      frmData2.append('amount', this.price);
    }
   
    frmData2.append('currencycode', this.currency);
       this.apiService
          .post('getpaypl_plan', frmData2, '')
          .subscribe((result2: any) => {
            console.log(result2);
            if (result2.status == true) {
              console.log('in', result2);
              // var plansss = [];
              this.plansss.push({id: result2.plandata.id, name: result2.plandata.name});
              // plansss = result2.plandata;
              this.plansss.map((plan) => {
          console.log('plan = ', plan)
          this.configs[plan.name] = this.getConfig(plan , plan.id);
          });

          console.log(this.configs)
         this.showPaypalbtnmonthly = true;
          this.payPalScriptService.registerPayPalScript(
          {
          clientId: 'AWwMSdBUP0ym7nQv2FWs68ACFzMTnuOlwxaGvidWZ586uI1AGSbA1rk5FsR_WGeAq7_4TVluX_bJwyuY',
          currency: this.currency,
          vault: "true",
          },
          (payPalApi) => {
          console.log('payPalApi = ', payPalApi);
          if (this.basicSubscription) {
          this.basicSubscription.customInit(payPalApi);
          }
          if (this.advancedSubscription) {
          this.advancedSubscription.customInit(payPalApi);
          }
          }
          );
            } else {
               console.log('errrr');
            }
          });
    }

    
  }

    getConfig(plan , plan_id: string): IPayPalConfig {
console.log('plan = ', plan)
var self = this;
return {
clientId: 'AWwMSdBUP0ym7nQv2FWs68ACFzMTnuOlwxaGvidWZ586uI1AGSbA1rk5FsR_WGeAq7_4TVluX_bJwyuY',
currency: self.currency,
vault: "true",
style: {
label: "paypal",
layout: "vertical",
size: "small",
shape: "pill",
color: "silver",
tagline: false,
},
createSubscription: function (data, actions) {
return actions.subscription.create({
plan_id,
});
},
onApprove: function (data, actions) {
console.log("subscription data:", data);
self.paymentDetails = data;
actions.subscription.get().then((details) => {
console.log("subscription details:", details);
// alert("Success to subscribe!");
self.paymentDetails = details;
// self.savepayments(details);
 self.spinner.show();
 var newdate = moment().format('Y-MM-DD HH:mm:ss');  
        const frmData = new FormData();
        frmData.append('userid', localStorage.getItem('user_id'));
        frmData.append('user_name', localStorage.getItem('user_name'));
        frmData.append('user_email', self.user_email);
        frmData.append('payment_id', details.id);
        frmData.append('plan_id', details.plan_id);
        frmData.append('current_period_start', newdate.toString());
        frmData.append('current_period_end', newdate.toString());
        frmData.append('subscription_id', details.subscriber.payer_id);
        frmData.append('payer_email', details.subscriber.email_address);
         if (self.supportUsForm.value.other_amount) {
      frmData.append('plan_amount', self.supportUsForm.value.other_amount);
    } else {
      frmData.append('plan_amount', self.price);
    }
   
    frmData.append('plan_currency', self.currency);
    frmData.append('plan_interval', '1 Month');

        self.apiService
          .post('payment-paypalmonth', frmData, '')
          .subscribe((result2: any) => {
            var res2;
            res2 = result2;
            console.log(res2);
            if (res2.status == true) {
              self.notifyService.showSuccessForTransaction(res2?.message);
              // this.supportUsForm.reset();
              self.router.navigateByUrl('/home');
            } else {
              self.responseData = [];
            }
          });
});
},
onCancel: (data, actions) => {
console.log("OnCancel", data, actions);
},
onError: (err) => {
console.log("OnError", err);
},
onClick: (data, actions) => {
self.planDetail = plan;
console.log("Clicked:",plan, data, actions);
},
};
}

  getProfileDetail() {
    const frmData = new FormData();
    frmData.append('userid', this.user_id);
    this.apiService.profileData(frmData).subscribe((res: any) => {
      if (res.status == true) {
        console.log('profile data support--->>>',res.data);
        this.user_name = res.data.user_name;
        this.user_email = res.data.uemail;
      }
    });
  }

  ngOnInit(): void {
    this.plans.map((plan) => {
      // this.configs[plan.name] = this.Config(plan.id);
    });

    this.payPalScriptService.registerPayPalScript(
      {
        clientId:
          'Afrb-jr306F41TY3PwMfoMkzPah0wtYvgONCMOU4ebaahbI38xEs04RWRMaawhDx6A-OSY9XiezBbmEA',
        currency: this.currency,
        vault: 'true',
      },
      (payPalApi) => {
        if (this.basicSubscription) {
          this.basicSubscription.customInit(payPalApi);
        }
        if (this.advancedSubscription) {
          this.advancedSubscription.customInit(payPalApi);
        }
      }
    );

    this.invokeStripe();
    this.supportUsForm = this.formBuilder.group({
      currency: [this.currency],
      payment_type: ['monthly'],
      other_amount: ['', Validators.required],
    });
    // this.formUpdate();
  }

  makePayment() {
    if (this.supportUsForm.value.other_amount) {
      localStorage.setItem(
        'other_amount',
        this.supportUsForm.value.other_amount
      );
      localStorage.setItem('price', null);
      localStorage.setItem('symbol', this.selected_currency_symbol);
    } else {
      localStorage.setItem('price', this.price);
      localStorage.setItem('other_amount', null);
      localStorage.setItem('symbol', this.selected_currency_symbol);
    }
    console.log(
      '-----Make payment-----',
      'other_amount=>',
      this.supportUsForm.value.other_amount,
      this.selected_currency_symbol,
      'price=>',
      this.price
    );
    console.log(this.selected_currency_symbol);

    const controls = this.supportUsForm.controls;

    if (this.supportUsForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    var dis = this;
    console.log('dis');
    dis.spinner.show();
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: this.stripeAPIKey,
      locale: 'auto',
      token: function (stripeToken: any) {
        this.stripeToken = stripeToken;
        console.log(stripeToken);
        const frmData1 = new FormData();
        frmData1.append('user_email', dis.user_email);
        frmData1.append('userid', localStorage.getItem('user_id'));
        frmData1.append('user_name', localStorage.getItem('user_name'));
        frmData1.append(
          'selected_currency_symbol',
          dis.selected_currency_symbol
        );
        frmData1.append('payment_type', dis.supportUsForm.value.payment_type);
        frmData1.append(
          'other_amount',
          dis.supportUsForm.value.other_amount != null
            ? dis.supportUsForm.value.other_amount
            : dis.price
        );
        frmData1.append(
          'price',
          dis.price != null ? dis.price : dis.supportUsForm.value.other_amount
        );
        frmData1.append('stripeToken', stripeToken.id);
        frmData1.append('currency_code', dis.currency);
        frmData1.append('email', stripeToken.email);
        
        frmData1.append('card', stripeToken.card.last4);
        console.log(dis.currency);
        console.log(dis.selected_currency_symbol);

        dis.apiService
          .post('payment-stripe', frmData1, '')
          .subscribe((result2: any) => {
            var res2;
            res2 = result2;
            console.log(res2);

            dis.spinner.hide();
            console.log(res2);
            if (res2.status == true) {
              console.log('in');
              dis.notifyService.showSuccessForTransaction(result2?.message);
              // this.toastr.notifyService.showSuccessForTransaction("Hello, I'm the toastr message.")
              dis.router.navigateByUrl('/home');
            } else {
              dis.notifyService.showError(result2.message);
            }
          });
      },
    });

    paymentHandler.open({
      name: 'Stripe Payment',
      currency:this.currency,
      // description: '3 widgets',
      //amount: amount * 100,
      amount:
        this.supportUsForm.value.other_amount != null
          ? this.supportUsForm.value.other_amount * 100
          : this.price * 100,
    });
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51LrfVxLTwCQPIkjJsYVyY8LBMZboiOGuSrzYrvqwSJmNNLHtnqRjP1jTmvZ2aNlG81dyJiPndukGM5JwKSV7vbKN00NuifshRZ',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
            alert('Payment has been successfull!');
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }

  get form() {
    return this.supportUsForm.controls;
  }

  amount(val) {
    this.showPaypalbtn = false;
    this.showPaypalbtnmonthly = false;
    this.showPaypalCondtion = false;
    console.log(val);
    this.price = val;
    this.supportUsForm.controls['other_amount'].reset();
    this.supportUsForm.controls['other_amount'].clearValidators();
    this.supportUsForm.controls['other_amount'].updateValueAndValidity();
   

   // pay button code
     this.submitted = true;
    localStorage.setItem('symbol', this.selected_currency_symbol);
    localStorage.setItem('currency', this.supportUsForm.value.currency);
    localStorage.setItem('payment_type', this.supportUsForm.value.payment_type);

    if (this.supportUsForm.value.other_amount) {
      localStorage.setItem('symbol', this.selected_currency_symbol);
      localStorage.setItem(
        'other_amount',
        this.supportUsForm.value.other_amount
      );
      localStorage.setItem('price', null);
    } else {
      localStorage.setItem('symbol', this.selected_currency_symbol);
      localStorage.setItem('price', this.price);
      localStorage.setItem('other_amount', null);
    }

    const controls = this.supportUsForm.controls;

    if (this.supportUsForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.showPaypalCondtion = true;
    localStorage.setItem('user_id', this.user_id);
    localStorage.setItem('user_name', this.user_name);
    console.log(
      '------------------check----------------',
      localStorage.getItem('price') != 'null'
        ? localStorage.getItem('price')
        : localStorage.getItem('other_amount'),
      localStorage.getItem('selected_currency_symbol')
    );
  }

  amount10(val) {
    this.showPaypalbtn = false;
    this.showPaypalbtnmonthly = false;
    this.showPaypalCondtion = false;
    console.log(val);
    this.price = val;
    this.supportUsForm.controls['other_amount'].reset();
    this.supportUsForm.controls['other_amount'].clearValidators();
    this.supportUsForm.controls['other_amount'].updateValueAndValidity();


// pay button code
     this.submitted = true;
    localStorage.setItem('symbol', this.selected_currency_symbol);
    localStorage.setItem('currency', this.supportUsForm.value.currency);
    localStorage.setItem('payment_type', this.supportUsForm.value.payment_type);

    if (this.supportUsForm.value.other_amount) {
      localStorage.setItem('symbol', this.selected_currency_symbol);
      localStorage.setItem(
        'other_amount',
        this.supportUsForm.value.other_amount
      );
      localStorage.setItem('price', null);
    } else {
      localStorage.setItem('symbol', this.selected_currency_symbol);
      localStorage.setItem('price', this.price);
      localStorage.setItem('other_amount', null);
    }

    const controls = this.supportUsForm.controls;

    if (this.supportUsForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.showPaypalCondtion = true;
    localStorage.setItem('user_id', this.user_id);
    localStorage.setItem('user_name', this.user_name);
    console.log(
      '------------------check----------------',
      localStorage.getItem('price') != 'null'
        ? localStorage.getItem('price')
        : localStorage.getItem('other_amount'),
      localStorage.getItem('selected_currency_symbol')
    );
  }

  amount20(val) {
    this.showPaypalCondtion = false;
    this.showPaypalbtn = false;
    this.showPaypalbtnmonthly = false;
    console.log(val);
    this.price = val;
    this.supportUsForm.controls['other_amount'].reset();
    this.supportUsForm.controls['other_amount'].clearValidators();
    this.supportUsForm.controls['other_amount'].updateValueAndValidity();


// pay button code
     this.submitted = true;
    localStorage.setItem('symbol', this.selected_currency_symbol);
    localStorage.setItem('currency', this.supportUsForm.value.currency);
    localStorage.setItem('payment_type', this.supportUsForm.value.payment_type);

    if (this.supportUsForm.value.other_amount) {
      localStorage.setItem('symbol', this.selected_currency_symbol);
      localStorage.setItem(
        'other_amount',
        this.supportUsForm.value.other_amount
      );
      localStorage.setItem('price', null);
    } else {
      localStorage.setItem('symbol', this.selected_currency_symbol);
      localStorage.setItem('price', this.price);
      localStorage.setItem('other_amount', null);
    }

    const controls = this.supportUsForm.controls;

    if (this.supportUsForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.showPaypalCondtion = true;
    localStorage.setItem('user_id', this.user_id);
    localStorage.setItem('user_name', this.user_name);
    console.log(
      '------------------check----------------',
      localStorage.getItem('price') != 'null'
        ? localStorage.getItem('price')
        : localStorage.getItem('other_amount'),
      localStorage.getItem('selected_currency_symbol')
    );
  }

  amount40(val) {
    this.showPaypalbtn = false;
    this.showPaypalbtnmonthly = false;
    this.showPaypalCondtion = false;
    console.log(val);
    this.price = val;
    
    
    this.supportUsForm.controls['other_amount'].reset();
    this.supportUsForm.controls['other_amount'].clearValidators();
    this.supportUsForm.controls['other_amount'].updateValueAndValidity();


// pay button code
     this.submitted = true;
    localStorage.setItem('symbol', this.selected_currency_symbol);
    localStorage.setItem('currency', this.supportUsForm.value.currency);
    localStorage.setItem('payment_type', this.supportUsForm.value.payment_type);

    if (this.supportUsForm.value.other_amount) {
      localStorage.setItem('symbol', this.selected_currency_symbol);
      localStorage.setItem(
        'other_amount',
        this.supportUsForm.value.other_amount
      );
      localStorage.setItem('price', null);
    } else {
      localStorage.setItem('symbol', this.selected_currency_symbol);
      localStorage.setItem('price', this.price);
      localStorage.setItem('other_amount', null);
    }

    const controls = this.supportUsForm.controls;

    if (this.supportUsForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.showPaypalCondtion = true;
    localStorage.setItem('user_id', this.user_id);
    localStorage.setItem('user_name', this.user_name);
    console.log(
      '------------------check----------------',
      localStorage.getItem('price') != 'null'
        ? localStorage.getItem('price')
        : localStorage.getItem('other_amount'),
      localStorage.getItem('selected_currency_symbol')
    );
  }

  changeCurrency(data: any) {
    this.showPaypalbtn = false;
    this.showPaypalbtnmonthly = false;
    console.log('data=>', data.value);
    this.currency = data.value;
    console.log(this.currency);
    console.log((data.value));
    
     localStorage.setItem('currencycode', data.value);
    // this.formUpdate();
    this.selected_currency = data.value;
    this.selected_currency_symbol = this.currencies.find(
      (x) => x.name == data.value
    ).symbol;
//        paypal.Buttons({
//   createOrder: function(data, actions) {
//     return actions.order.create({
//       purchase_units: [{
//         amount: {
//           value: localStorage.getItem('price') != 'null'
//                         ? localStorage.getItem('price')
//                         : localStorage.getItem('other_amount'),
//           currency_code: this.selected_currency,
//         }
//       }]
//     });
//   },
//   //...
// }).render(this.paypalElement.nativeElement);

  }

  submitForm() {
    this.submitted = true;
    localStorage.setItem('symbol', this.selected_currency_symbol);
    localStorage.setItem('currency', this.supportUsForm.value.currency);
    localStorage.setItem('payment_type', this.supportUsForm.value.payment_type);

    if (this.supportUsForm.value.other_amount) {
      localStorage.setItem('symbol', this.selected_currency_symbol);
      localStorage.setItem(
        'other_amount',
        this.supportUsForm.value.other_amount
      );
      localStorage.setItem('price', null);
    } else {
      localStorage.setItem('symbol', this.selected_currency_symbol);
      localStorage.setItem('price', this.price);
      localStorage.setItem('other_amount', null);
    }

    const controls = this.supportUsForm.controls;

    if (this.supportUsForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.showPaypalCondtion = true;
    localStorage.setItem('user_id', this.user_id);
    localStorage.setItem('user_name', this.user_name);
    console.log(
      '------------------check----------------',
      localStorage.getItem('price') != 'null'
        ? localStorage.getItem('price')
        : localStorage.getItem('other_amount'),
      localStorage.getItem('selected_currency_symbol')
    );
    // this.initConfig();
  }

  otherInputFunc() {
    this.showPaypalCondtion = false;
    this.showPaypalbtn = false;
    this.showPaypalbtnmonthly = false;
    this.price = null;
    // console.log(this.price)
    this.supportUsForm.controls['other_amount'].setValidators([
      Validators.required,
    ]);
    this.supportUsForm.controls['other_amount'].updateValueAndValidity();

// pay button code
     this.submitted = true;
    localStorage.setItem('symbol', this.selected_currency_symbol);
    localStorage.setItem('currency', this.supportUsForm.value.currency);
    localStorage.setItem('payment_type', this.supportUsForm.value.payment_type);

    if (this.supportUsForm.value.other_amount) {
      localStorage.setItem('symbol', this.selected_currency_symbol);
      localStorage.setItem(
        'other_amount',
        this.supportUsForm.value.other_amount
      );
      localStorage.setItem('price', null);
    } else {
      localStorage.setItem('symbol', this.selected_currency_symbol);
      localStorage.setItem('price', this.price);
      localStorage.setItem('other_amount', null);
    }

    const controls = this.supportUsForm.controls;

    if (this.supportUsForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.showPaypalCondtion = true;
    localStorage.setItem('user_id', this.user_id);
    localStorage.setItem('user_name', this.user_name);
    console.log(
      '------------------check----------------',
      localStorage.getItem('price') != 'null'
        ? localStorage.getItem('price')
        : localStorage.getItem('other_amount'),
      localStorage.getItem('selected_currency_symbol')
    );
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.supportUsForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  public initConfig(): void {
var dis = this;
        setTimeout(function(){
           console.log('hitime')
           dis.showPaypalbtn = true;
           },2000);
    
    
    // console.log('other_amount=>', localStorage.getItem('other_amount'), 'price=>', localStorage.getItem('price'));
    console.log('fghjmdncvdfhjd,',localStorage.getItem('currencycode'));


    this.payPalConfig = {
      currency: this.currency,
      clientId:
        'AWwMSdBUP0ym7nQv2FWs68ACFzMTnuOlwxaGvidWZ586uI1AGSbA1rk5FsR_WGeAq7_4TVluX_bJwyuY',
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code:this.currency,
                value:
                  localStorage.getItem('price') != 'null'
                    ? localStorage.getItem('price')
                    : localStorage.getItem('other_amount'),
                breakdown: {
                  item_total: {
                    currency_code: this.currency,
                    value:
                      localStorage.getItem('price') != 'null'
                        ? localStorage.getItem('price')
                        : localStorage.getItem('other_amount'),
                  },
                },
              },
              items: [
                {
                  name: 'Enterprise Subscription',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: this.currency,
                    value:
                      localStorage.getItem('price') != 'null'
                        ? localStorage.getItem('price')
                        : localStorage.getItem('other_amount'),
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'false',
        extraQueryParams: [{ name: 'disable-funding', value: 'credit,card' }],
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        );
        actions.order.get().then((details) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );
        this.showSuccess = true;
        // payment-paypal
        this.spinner.show();
        const frmData = new FormData();
        frmData.append('userid', localStorage.getItem('user_id'));
        frmData.append('user_name', localStorage.getItem('user_name'));
        frmData.append('user_email', this.user_email);
        frmData.append('other_amount', localStorage.getItem('other_amount'));
        frmData.append('price', localStorage.getItem('price'));
        // frmData.append("send_me_poems", text);
        frmData.append('payment_id', data.id);
        frmData.append('create_time', data.create_time);
        frmData.append('update_time', data.update_time);
        frmData.append('payer_id', data.payer.payer_id);
        frmData.append('payer_email_address', data.payer.email_address);
        frmData.append('amount', data.purchase_units[0].amount.value);
        frmData.append(
          'currency_code',
          data.purchase_units[0].amount.currency_code
        );

        this.apiService
          .post('payment-paypal', frmData, '')
          .subscribe((result2: any) => {
            var res2;
            res2 = result2;
            console.log(res2);
            if (res2.status == true) {
              this.notifyService.showSuccessForTransaction(res2?.message);
              // this.supportUsForm.reset();
              this.router.navigateByUrl('/home');
            } else {
              this.responseData = [];
            }
          });
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.showCancel = true;
      },
      onError: (err) => {
        console.log('OnError', err);
        this.showError = true;
      },
    };

  }
}
