import { Component, OnInit } from '@angular/core';
import { environment } from "../environments/environment";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { onBackgroundMessage } from "firebase/messaging/sw";
import { SwPush } from '@angular/service-worker';
import { OneSignalService } from './one-signal.service';
import { ApiService } from './services/api.service'; 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Green Pheasants';
  message:any = null;
     registrationtoken:any = [];
  constructor(private oneSignal: OneSignalService,private apiService:ApiService,private serviceWorker:SwPush) {
  localStorage.setItem('green_appinstalled','true');
  localStorage.setItem('installicn','false');
   console.log('green_appinstalled-----true');
   if (window.matchMedia('(display-mode: standalone)').matches) {  
   console.log('app open pwa');  
}
else{
  console.log('web pwa');
}
   // setTimeout(async () => {
   //    await this.oneSignal.init({ appId: '11b22bad-ff6f-4a67-8e28-b7bb17d646bf',
   //      serviceWorkerParam: {
   //   scope: 'https://www.greenpheasants.com/'
   // },
   // serviceWorkerPath: '../OneSignalSDKWorker.js'
   //  }).then((res) => {
   //       console.log('res----', res);
   //       });

   //        this.oneSignal.isPushNotificationsEnabled().then((data) => {
   //            console.log('data11>>', data);
   //        })

   //         this.oneSignal.getUserId().then((data) => {
   //              console.log('data22>>', data);
   //          })
   //    }, 1000);
  }
 
      //  messaging.useServiceWorker(registration);
      //  messaging.requestPermission();
      //  messaging.getToken();
   
  ngOnInit(): void {
    this.requestPermission();
    this.listen();
    this.oneSignal.onInit();
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

  
//   onBackgroundMessage(messaging, (payload1) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload1);
//   // Customize notification here
//   const notificationTitle = payload1.notification.title;
//   const notificationOptions = {
//     body: payload1.notification.body,
//     // icon: '/firebase-logo.png'
//   };

// });
   

  }
}

if ('serviceWorker' in navigator) {

  navigator.serviceWorker.register('../firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Registration successful, scope is:', registration.scope);
    }).catch(function(err) {
      console.log('Service worker registration failed, error:', err);
    });

   //    navigator.serviceWorker.getRegistration().then(function(reg) {
   // console.log('reached here', reg); // this too gets logged
   // this.registrationtoken = reg;
// if(this.message){
//    const notificationTitle = this.message.notification.title;
//   const notificationOptions = {
//     body: this.message.notification.body,
//     // icon: '/firebase-logo.png'
//   };

//   reg.showNotification(notificationTitle,notificationOptions);
// }
    

 //   reg.showNotification('hiiiiiiiiiiiiiiiiiiiii');
 // }).catch(function(err) {
 //      console.log('not reached, error:', err);
 //    });
  }
