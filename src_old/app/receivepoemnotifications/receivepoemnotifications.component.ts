import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ApiService } from '../../app/services/api.service' 
import {config} from '../../app/services/config'
import { Validators,FormBuilder,FormGroup,ReactiveFormsModule } from '@angular/forms';
import * as $ from 'jquery';
import {NotificationService } from '../../app/services/notification.service' 
import { NgxSpinnerService } from "ngx-spinner";
import {GlobalFooService } from '../../app/services/globalFooService.service';
@Component({
  selector: 'app-receivepoemnotifications',
  templateUrl: './receivepoemnotifications.component.html',
  styleUrls: ['./receivepoemnotifications.component.scss'],
})

export class ReceivepoemnotificationsComponent implements OnInit {
  
  isShown: boolean = false; // hidden by default
  modalRef?: BsModalRef;
  hideShowDiv: boolean;

  toggleShow() {
    this.isShown = !this.isShown;
  }
  
  // poemRecommendForMobile
  user_id:any;
  check_platform:any = '';
  public poemRecommendForMobile : FormGroup;
  submitted = false;
  errors:any=['',null,undefined,false,'null','undefined'];
  urec_push_freq:any;
  responseData:any;


  constructor(private spinner: NgxSpinnerService,private SharedService: GlobalFooService,private notifyService : NotificationService,private apiService:ApiService,private formBuilder: FormBuilder,private modalService: BsModalService,private router:Router,private toastr: ToastrService) {
    this.hideShowDiv = true;
    this.user_id = this.apiService.decryptData(localStorage.getItem('user_token'),config.ENC_SALT);
    this.getProfileDetail();
    this.getPWADisplayMode();
    this.poemRecommendForMobile = this.formBuilder.group({
        urec_push_freq: ['', Validators.required],
        user_id    : [this.user_id],
        sendPoemVia: ['via_mobile'],
        recommend_poem: [1]
    });

  }

  getPWADisplayMode() {
    console.log('testttttt');
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (document.referrer.startsWith('android-app://')) {
    this.check_platform = "twa";
    console.log('twa');
    return 'twa';
  } else if (window.navigator['standalone'] || isStandalone) {
     console.log('standalone');
     this.check_platform = "standalone";
    return 'standalone';
  }
   console.log('browser');
   this.check_platform = "browser";
  return 'browser';

  
}

  getProfileDetail(){

    const frmData = new FormData();
		frmData.append("userid", this.user_id);
    this.apiService.profileData(frmData).subscribe((res: any) => {
      if (res.status==true) {
        this.responseData = res.data;
        console.log('profile',this.responseData.recommend_poem);
        if(this.responseData.recommend_poem == 1){
        this.poemRecommendForMobile.controls['urec_push_freq'].setValue(this.responseData.urec_push_freq.toString());
      }
      } else {
        this.responseData=[];
      }
    });
  }

  redirectonload(){
     this.router.navigateByUrl('/app-download');
  }


  sendnotify(){
    // const controls = this.poemRecommendForMobile.controls;
     if(this.poemRecommendForMobile.value.urec_push_freq==''){
      this.notifyService.showError('Please select how many times you want the poem on your mobile phone');
    return;
  }
    const frmData = new FormData();
    frmData.append("id", localStorage.getItem('green_userid'));
    frmData.append("cron_val",this.poemRecommendForMobile.controls['urec_push_freq'].value);
     
    this.apiService.post('sendpoemonfcm',frmData,'').subscribe((res:any) => {
      if (res.status==true) {
        // this.spinner.hide();
        // this.responseData = res.data;
        console.log('randompoemdata',res);
        this.anthrdataa();
        this.notifyService.showSuccess(res.message);
        this.router.navigateByUrl('/');
        
      } else {
        // this.spinner.hide();
        console.log('err');
      }
    });
  }

  anthrdataa() {

    this.spinner.show();
    console.log('here',this.poemRecommendForMobile.value)
    this.submitted = true;

    console.log(this.poemRecommendForMobile)
    if(this.poemRecommendForMobile.value.urec_push_freq==''){
      this.notifyService.showError('Please select how many times you want the poem on your mobile phone');
    }

    // stop here if form is invalid
    if (this.poemRecommendForMobile.invalid) {
      return;
    } 
    
    this.apiService.post('send-me-a-poem',this.poemRecommendForMobile.value,'').subscribe((result:any) => {
      var res;
      res = result;  
      // this.spinner.hide();
      // this.notifyService.showSuccess(res.message);
      // console.log('get',res.status);
    },
    err => {
        // this.spinner.hide();
        // this.notifyService.showError('No record found');
    });

    // this.modalRef = this.modalService.show(
    //   template,
    //   Object.assign({}, { class: 'thankModal modal-dialog-centered' })
    // );
  }

  get rForm() {
    return this.poemRecommendForMobile.controls;
  }

  openModal(template: TemplateRef<any>) {

    this.spinner.show();
    console.log('here',this.poemRecommendForMobile.value)
    this.submitted = true;

    console.log(this.poemRecommendForMobile)
    if(this.poemRecommendForMobile.value.urec_push_freq==''){
      this.notifyService.showError('Please select how many times you want the poem on your mobile phone');
    }

    // stop here if form is invalid
    if (this.poemRecommendForMobile.invalid) {
      return;
    } 
    
    this.apiService.post('send-me-a-poem',this.poemRecommendForMobile.value,'').subscribe((result:any) => {
      var res;
      res = result;  
      this.spinner.hide();
      this.notifyService.showSuccess(res.message);
      console.log('get',res.status);
    },
    err => {
        this.spinner.hide();
        this.notifyService.showError('No record found');
    });

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'thankModal modal-dialog-centered' })
    );
  }

  closeModal(modalId?: number) {
    this.modalService.hide(modalId);
  }

  ngOnInit(): void {}
}
