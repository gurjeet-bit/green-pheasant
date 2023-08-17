import {Injectable} from '@angular/core';
import { map } from 'rxjs/operators';
import {HttpHeaders,HttpClient} from '@angular/common/http'
import * as CryptoJS from 'crypto-js'
import {Router} from '@angular/router';
import {config} from '../../app/services/config'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  user_id:any;
  responseData:any;
  url:any = config.API_URL;

  constructor(private http:HttpClient) { }

  post(endpoint,data,headers){
    let API_URL = this.url+endpoint;
    return this.http.post(API_URL,data)
    .pipe(
      map((res: Response) => {
        return res
      }),
      )
  }
  
  register(data): Observable<any> {
    let API_URL = this.url+'user-registration';
    return this.http.post(API_URL,data)
    .pipe(
      map((res: Response) => {
        return res
      }),
      )
  }

  // getLocation(lat,lng): Observable<any> {
  //   // return false;
  //   let API_URL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key=AIzaSyDnMvJXKTsrCcDRdM03l8TlIdlYZuIXQHs';
  //   return this.http.get(API_URL)
  //   .pipe(
  //     map((res: Response) => {
  //       return res
  //     }),
  //     )
  // }

  login(data): Observable<any> {
    let API_URL = this.url+'user-login';
    return this.http.post(API_URL,data)
      .pipe(
        map((res: Response) => {
          return res
        }),
        )
  }

  contact(data): Observable<any> {
    let API_URL = this.url+'contact-us';
    return this.http.post(API_URL,data)
      .pipe(
        map((res: Response) => {
          return res
        }),
        )
  }

  privacyPolicy(data): Observable<any> {
    let API_URL = this.url+'privacy-policy';
    return this.http.post(API_URL,data)
      .pipe(
        map((res: Response) => {
          return res
        }),
        )
  }

  termCondtion(data): Observable<any> {
    let API_URL = this.url+'term-condition';
    return this.http.post(API_URL,data)
      .pipe(
        map((res: Response) => {
          return res
        }),
      )
  }

  emailVerification(data): Observable<any> {
    let API_URL = this.url+'user-email-verification';
    return this.http.post(API_URL,data)
      .pipe(
        map((res: Response) => {
          return res
        }),
      )
  }

  faq(data): Observable<any> {
    let API_URL = this.url+'faq-list';
    return this.http.post(API_URL,data)
      .pipe(
        map((res: Response) => {
          return res
        }),
        )
  }

  
  aboutUs(data): Observable<any> {
    let API_URL = this.url+'get-about-us';
    return this.http.post(API_URL,data)
      .pipe(
        map((res: Response) => {
          return res
        }),
        )
  }

  profileData(data): Observable<any> {
    let API_URL = this.url+'get-profile';
    return this.http.post(API_URL,data)
      .pipe(
        map((res: Response) => {
          return res
        }),
        )
  }

  stripePayment1(data): Observable<any> {
    let API_URL = this.url+'payment-stripe';
    return this.http.post(API_URL,data)
      .pipe(
        map((res: Response) => {
          return res
        }),
        )
  }

  forgotPassword(data): Observable<any> {
    let API_URL = this.url+'forgot-password';
    return this.http.post(API_URL,data)
      .pipe(
        map((res: Response) => {
          return res
        }),
        )
  }

  resetPassword(data): Observable<any> {
    let API_URL = this.url+'reset-password';
    return this.http.post(API_URL,data)
      .pipe(
        map((res: Response) => {
          return res
        }),
        )
  }

  recommendPoem(data): Observable<any> {
    let API_URL = this.url+'recommend-poem';
    return this.http.post(API_URL,data)
    .pipe(
      map((res: Response) => {
        return res
      }),
    )
  }

  addToCollection(data): Observable<any> {
    let API_URL = this.url+'add-to-collection';
    return this.http.post(API_URL,data)
      .pipe(
        map((res: Response) => {
          return res
        }),
      )
  }

  updateSession(data): Observable<any> {
    let API_URL = this.url+'get-session';
    return this.http.post(API_URL,data)
      .pipe(
        map((res: Response) => {
          return res
        }),
        )
  }

  profileUpdateData(data): Observable<any> {
    this.user_id= this.decryptData(localStorage.getItem('user_token'),config.ENC_SALT);
    let API_URL = this.url+'update-profile'+'/'+this.user_id;
    return this.http.post(API_URL,data)
      .pipe(
        map((res: Response) => {
          return res
        }),
        )
  }

  encryptData(data:any,salt:any) {
	    try {
	        var enc = CryptoJS.AES.encrypt(JSON.stringify(data), salt).toString();
	        enc = enc.split('+').join('xMl3Jk').split('/').join('Por21Ld').split('=').join('Ml32');
	        return enc;
	    } catch (e) {
	        return 0;
	    }
	}

  decryptData(data:any, salt:any) {
    try {
      data = data
        .split('xMl3Jk')
        .join('+')
        .split('Por21Ld')
        .join('/')
        .split('Ml32')
        .join('=');
      const bytes = CryptoJS.AES.decrypt(data, salt);
      if (bytes.toString()) {
        const dec = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return dec;
      }
      return data;
    } catch (e) {
      return 0;
    }
  }



}
