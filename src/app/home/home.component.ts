import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { faChevronRight, faL } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { Router,ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { config } from '../services/config';
import { FormBuilder, FormGroup, Validators,FormControl, FormArray } from '@angular/forms';
import * as $ from 'jquery';
import { GlobalFooService } from '../services/globalFooService.service';
import { NotificationService } from '../services/notification.service';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  faChevronRight = faChevronRight;
  flag: any;
  poem_id:any;
  poemData:any;
  user_id:any;
  responseData:any;
  public lat;
  public lng;
  private geoCoder;
  address:any;
  zoom:any;
  country_short_name:any;
  deviceInfo:DeviceInfo;
  sessionid:any;
  theme:any = 'Love';
  mood:any = 'Sunny';
  poemType:any;
  securityCode:any;
  registration_id:any;

  constructor(public activatedRoute: ActivatedRoute,private spinner: NgxSpinnerService,private deviceDetectorService: DeviceDetectorService,private ngZone: NgZone,private datePipe: DatePipe,private notifyService : NotificationService,private apiService:ApiService,private router:Router,private toastr: ToastrService) {
    this.flag = 1;
    this.deviceInfo = this.deviceDetectorService.getDeviceInfo();

    if(localStorage.getItem('is_logged_in') == 'true'){
      this.user_id = this.apiService.decryptData(localStorage.getItem('user_token'),config.ENC_SALT);
    }else{
      this.user_id='';
    }
    
    this.securityCode = activatedRoute.snapshot.paramMap.get('securityCode');  
    this.registration_id = activatedRoute.snapshot.paramMap.get('registration_id');  
    if(this.securityCode && this.registration_id){
      this.verification(this.securityCode,this.registration_id);
    }
     localStorage.removeItem('poemselected_type'); 
      localStorage.removeItem('poemType'); 
  }

  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    // this.getUserDetail();	
  }
  
  ngAfterViewInit(){
    // this.getUserDetail();	
  }

  // async ngOnInit() {
  //   this.getUserDetail();	
  // }

  // getLocation() {
    //  navigator.geolocation.getCurrentPosition(function(){
    //     alert('Location accessed')
    // },function(){
    //       alert('User not allowed')
    // },{timeout:10000})
    
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((position: any) => {
    //     if (position) {
    //       this.lat = position.coords.latitude;
    //       this.lng = position.coords.longitude;
    //       this.apiService.getLocation(this.lat,this.lng).subscribe((res: any) => {  
    //         console.log('res =>',res.results[0].address_components[4],
    //         'shortName of country =>',res.results[0].address_components[4].short_name)

    //         this.country_short_name = res.results[0].address_components[4].short_name;
    //         this.getUserDetail();	
    //       });  
    //     }
    //   },
    //   );
    // }else{
    //   alert("Geolocation is not supported by this browser.");
    // }
  // }

  // getUserDetail(){
  //   const frmData = new FormData();
	// 	frmData.append("userid", this.user_id);
  //   this.apiService.profileData(frmData).subscribe((res: any) => {
  //     if (res.status==true) {
  //       this.responseData = res.data;
  //     } else {
  //       this.responseData.id=null;
  //       this.notifyService.showError(res.message)
  //     }
  //   });
  // }

  // sessionCreated(){
  //   const frmData = new FormData();
	// 	frmData.append("userid", this.user_id);
  //   let currentDateTime =this.datePipe.transform((new Date), 'MM/dd/yyyy h:mm:ss');
  //   if(this.deviceInfo.orientation=='landscape'){
  //     var svertical ='0';
  //   }else if(this.deviceInfo.orientation=='portrait'){
  //     var svertical ='1';
  //   }else{
  //     var svertical ='2';
  //   }
  //   if(localStorage.getItem('sessionid')){
  //       this.sessionid =    localStorage.getItem('sessionid');
  //       frmData.append("sessionid", localStorage.getItem('sessionid'));
  //   }
	// 	frmData.append("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);
	// 	frmData.append("sstart", currentDateTime);
	// 	frmData.append("send", null);
	// 	frmData.append("sduration", null);
	// 	frmData.append("smobile", '0');
	// 	frmData.append("sapp", '0');
	// 	frmData.append("svertical", svertical);    
  //   this.apiService.updateSession(frmData).subscribe((res: any) => {
  //     if (res.status==true) {
  //       // console.log(res,res.status,res.data)
  //       this.responseData = res.data;
  //       localStorage.setItem('sessionid',res?.sessionData?.id);
  //       // console.log('session_id',res?.sessionData?.id)
  //     } else {
  //       this.responseData.id=null;
  //       this.notifyService.showError(res.message)
  //     }
  //   });
  // }

  verification(securityCode, registration_id) {
      const frmData = new FormData();  
      frmData.append("securityCode", securityCode);
		  frmData.append("registration_id", registration_id);
      this.apiService.post('user-email-verification',frmData,'').subscribe((result:any) => {
      var res;
      res = result;  
      this.spinner.hide();
      console.log('get',res.status)
      if (res.status==true) {
        this.poemData = res.data;
        this.router.navigateByUrl('/search-poem-detail/'+this.poemData.itemid);
      } else {
        this.notifyService.showError('No record found')
         this.router.navigateByUrl('/home');
      }
    },
    err => {
        this.spinner.hide();
        this.notifyService.showError('No record found')
         this.router.navigateByUrl('/home');
    }); 
  }

   recommendPoem(){
    this.spinner.show();
    const frmData = new FormData(); 
    frmData.append("flag", this.flag);
     localStorage.setItem('poemselected_type', this.flag);
    if(this.flag==1){
      this.poemType = 'any';
       localStorage.setItem('poemType', this.poemType);
    } else if(this.flag==2){
      frmData.append("poemType", this.theme); 
       localStorage.setItem('poemType', this.theme);
    } else{
      frmData.append("poemType", this.mood); 
       localStorage.setItem('poemType', this.mood);
    }
    if(this.user_id){
      frmData.append("userid", this.user_id);
    }else{
      this.user_id = 0;
      frmData.append("userid", this.user_id);
    }

    this.apiService.post('recommend-poem',frmData,'').subscribe((result:any) => {
      var res;
      res = result;  
      console.log('get',res.status)
      if (res.status==true) {
        this.spinner.hide();
        this.poemData = res.data;
        this.router.navigateByUrl('/search-poem-detail/'+this.poemData.itemid);
      } else {
        this.notifyService.showError('No record found')
        this.router.navigateByUrl('/home');
      }
      this.spinner.hide();
    },
    err => {
        this.spinner.hide();
        this.notifyService.showError('No record found')
        this.router.navigateByUrl('/home');
    }); 
  }

}
