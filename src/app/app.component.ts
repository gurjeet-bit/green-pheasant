import { Component, OnInit , Inject,HostListener, OnDestroy} from '@angular/core';
import { environment } from "../environments/environment";
import {Platform} from '@ionic/angular';
import { HttpClient  } from '@angular/common/http';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { onBackgroundMessage } from "firebase/messaging/sw";
import { SwPush } from '@angular/service-worker';
import { OneSignalService } from './one-signal.service';
import { ApiService } from './services/api.service'; 
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterState } from '@angular/router';
 import { DeviceDetectorService } from 'ngx-device-detector';
 import { UserIdleService } from 'angular-user-idle';
 import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    alert(event);
    event.preventDefault();
    event.returnValue = 'Your data will be lost!';
    return false;
  }

  title = 'Green Pheasants';
  message:any = null;
  deviceInfo:any;
  countrycode:any;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  titles = 'angular-idle-timeout';
   api_key = 'f5f034f765fd45c9b80cd603e24add2b';

  url = 'https://ipgeolocation.abstractapi.com/v1/?api_key=' + this.api_key;
     registrationtoken:any = [];
  constructor(private http:HttpClient,private oneSignal: OneSignalService,private apiService:ApiService,private serviceWorker:SwPush,
      private router: Router,private userIdle: UserIdleService,
    private titleService: Title,private idle: Idle, private keepalive: Keepalive,
    @Inject(DOCUMENT) private document: Document, private deviceService: DeviceDetectorService,private platform: Platform) {
  localStorage.setItem('green_appinstalled','true');
  localStorage.setItem('installicn','false');
   console.log('green_appinstalled-----true');
   this.http.get(this.url).subscribe((res:any)=>{

      console.log('country data---',res.country_code)
this.countrycode = res.country_code;
    });
   if (window.matchMedia('(display-mode: standalone)').matches) {  
   console.log('app open pwa');  
}
else{
  console.log('web pwa');
}

 //            platform.ready().then(() => {
 //              console.log('platform ready');

 // this.platform.pause.subscribe(() => { 
 //               console.log('****UserdashboardPage PAUSED****');
 //                 var sids = localStorage.getItem('session_gid');
 //      // const param3 = {
 //      //           id:sids,
 //      //         };
 //      // this.apiService.post('get_sessiononpause',param3,'').subscribe((result4:any) => {
 //                // console.log('getsession info=>', result4);
 //                 var sids = localStorage.getItem('session_gid');
 //               const param1 = {
 //                send: new Date(),
 //                sduration: 123,
 //                id:sids,
 //              };
 //              this.apiService.post('update_sessiononpause',param1,'').subscribe((result3:any) => {
 //                console.log('session info=>', result3);
 //              }, error => {
 //                console.log(error);
 //              });
 //              // }, error => {
 //              //   console.log(error);
 //              // });
 //           });

 //            });
         


   this.handleRouteEvents();
   var self = this;
   setTimeout(function(){
   self.epicFunction();
    }, 4000);
   

  }



  epicFunction() {
      
      console.log('hello `Home` component' ,this.countrycode);
      this.deviceInfo = this.deviceService.getDeviceInfo();
      const isMobile = this.deviceService.isMobile();
      const isTablet = this.deviceService.isTablet();
      const isDesktopDevice = this.deviceService.isDesktop();
      console.log(this.deviceInfo);
      console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
      console.log(isTablet);  // returns if the device us a tablet (iPad etc)
      console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.

       const param1 = {
                logged_in: localStorage.getItem('green_userid') ? 1 : 0,
                userid: localStorage.getItem('green_userid') ? localStorage.getItem('green_userid') : '',
                sstart: new Date(),
                country_code: this.countrycode,
                smobile: isMobile ? '1' : (isDesktopDevice ? '0' : ''),
                snumitems: 1,
                svertical: this.deviceInfo.orientation == 'horizontal' ? '0' : (this.deviceInfo.orientation == 'vertical' ? '1' : '2'),
              };
              this.apiService.post('update_session',param1,'').subscribe((result3:any) => {
                console.log('session info1111111=>', result3.sdata);
            //      localStorage.setItem('session_gid',result3.sdata);
            //      localStorage.setItem('session_items','0');
            //       const param2 = {
            //     snumitems: 1,
            //     id:result3.sdata,
            //   };
            // this.apiService.post('update_sessionoitems',param2,'').subscribe((result34:any) => {
            //     console.log('session info=>', result34);
            //                   const param11 = {
            //     send: new Date(),
            //     sduration: 12345,
            //     id:result3.sdata,
            //   };
            //   this.apiService.post('update_sessiononpause',param11,'').subscribe((result3:any) => {
            //     console.log('session info=>', result3);
            //   }, error => {
            //     console.log(error);
            //   });
            //   }, error => {
            //     console.log(error);
            //   });
              }, error => {
                console.log(error);
              });
              
    }
 
      //  messaging.useServiceWorker(registration);
      //  messaging.requestPermission();
      //  messaging.getToken();
   
  ngOnInit(): void {
    this.requestPermission();
    this.listen();
    this.oneSignal.onInit();

  }


   ngOnDestroy(){
    console.log('sadsfghjhhkgjfh');
  }
  

  handleRouteEvents() {
    this.router.events.subscribe(event => {
      // console.log('google analystic event',event);
      if (event instanceof NavigationEnd) {
        const title = this.getTitle(this.router.routerState, this.router.routerState.root).join('-');
        this.titleService.setTitle(title);
        gtag('event', 'page_view', {
          page_title: title,
          page_path: event.urlAfterRedirects,
          page_location: this.document.location.href
        })
      }
    });
  }

  getTitle(state: RouterState, parent: ActivatedRoute): string[] {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data['title']) {
      data.push(parent.snapshot.data['title']);
    }
    if (state && parent && parent.firstChild) {
      data.push(...this.getTitle(state, parent.firstChild));
    }
    // console.log('google analystic data',data);
    return data;
  }

 
 
  //  const messaging = firebase.messaging();
 

 

  // Request permission and get token.....

  requestPermission() {

    const messaging = getMessaging();
    
  
    getToken(messaging, { vapidKey: environment.firebase.vapidKey }).then((currentToken) => {
      if (currentToken) {
        console.log("Hurraaa!!! we got the token.....")
        console.log(currentToken);
            // this.tokens = currentToken;
          const param = {
                id: localStorage.getItem('green_userid'),
                fcm_token: currentToken
              };
              this.apiService.post('update_fcmtoken',param,'').subscribe((result2:any) => {
                console.log('user info=>', result2);
              }, error => {
                console.log(error);
              });
 
        // Send the token to your server and update the UI if necessary
        // ...
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    })

  }

  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message=payload;
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // icon: '/firebase-logo.png'
  };
      console.log('mdata--', this.message.notification.title, this.message['notification']);
        navigator.serviceWorker.register('../firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Registration successful, scope is:', registration.scope);
       registration.showNotification(notificationTitle,notificationOptions);
    }).catch(function(err) {
      console.log('Service worker registration failed, error:', err);
    });


    });

   

  }
}

if ('serviceWorker' in navigator) {

  navigator.serviceWorker.register('../firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Registration successful, scope is:', registration.scope);
    }).catch(function(err) {
      console.log('Service worker registration failed, error:', err);
    });

  }
