import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OneSignalService {
  constructor() {
 

  }

 async onLoad(): Promise<any> {
    window.OneSignal = window.OneSignal || [];
    return new Promise((resolve) => {
      window.OneSignal.push(function() {
        resolve(window.OneSignal);
      });
    });
  }

    onInit():void {
    this.onLoad().then((OneSignal)=>{
      OneSignal.init({
        appId: "11b22bad-ff6f-4a67-8e28-b7bb17d646bf",
      });

      OneSignal.push(function() {
  OneSignal.isPushNotificationsEnabled().then(function(isEnabled) {
    if (isEnabled)
      console.log("Push notifications are enabled!");
    else
      console.log("Push notifications are not enabled yet.");      
  });
});
    })
  }

}