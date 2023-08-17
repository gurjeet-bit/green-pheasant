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
  selector: 'app-unsubscribemail',
  templateUrl: './unsubscribemail.component.html',
  styleUrls: ['./unsubscribemail.component.scss'],
})

export class UnsubscribemailComponent implements OnInit {

  faChevronRight = faChevronRight;
  token: any;
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
    this.token  = activatedRoute.snapshot.paramMap.get('token');
    this.user_id  = activatedRoute.snapshot.paramMap.get('id');
    this.checkTokenVerification(this.token)
  }

  ngOnInit() {
  }


checkTokenVerification(token){
    this.spinner.show();
    const frmData = new FormData(); 
    frmData.append("token", token);
    frmData.append("userid", this.user_id);
    this.apiService.post('unsubscribe-email-verification',frmData,'').subscribe((result:any) => {
      var res;
      res = result;  
      // this.spinner.hide();
      if (res.status==true) {
        this.spinner.hide();
        this.notifyService.showSuccess(res.message)
        this.router.navigateByUrl('/home');
      } else {
        this.notifyService.showError(res.message)
        setTimeout(function(){
          console.log('hi')
        },3000);
        this.router.navigateByUrl('/home');
      }
    },
    err => {
        this.spinner.hide();
        this.notifyService.showError('No record found')
        this.router.navigateByUrl('/home');
    }); 
    
  }
}
