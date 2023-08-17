import { Component, OnInit, TemplateRef,ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ApiService } from '../../app/services/api.service'; 
import {config} from '../../app/services/config'
import { FormBuilder,FormGroup,FormControl, Validators } from '@angular/forms';
import * as $ from 'jquery';
import {GlobalFooService } from '../../app/services/globalFooService.service'  
import {NotificationService } from '../../app/services/notification.service' 
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss'],
})

export class MyprofileComponent implements OnInit {
  url:any = config.API_URL;
  modalRef?: BsModalRef | null;
  modalRef2?: BsModalRef | null;
  user_name:any;
	email:any;
  user_email:any;
  mailcontent:any= 'tet test test';
  old_password:any;
  password:any;
	confirm_password:any;
	subscribe_me:any;
	send_recommened_poem:any;
	send_notification:any;
  submitted = false;
  submittedForChangePassword = false;

	errors:any=['',null,undefined,false];
	is_submit:boolean=false;
  user_id:any;
  subscription:Subscription
  responseData:any;
@ViewChild('myArea') myTextArea: any;
  constructor(private SharedService: GlobalFooService,private spinner: NgxSpinnerService,private notifyService : NotificationService,private apiService:ApiService,private formBuilder: FormBuilder,private modalService: BsModalService,private router:Router,private toastr: ToastrService) { 

    this.initForm();
    this.user_id= this.apiService.decryptData(localStorage.getItem('user_token'),config.ENC_SALT);

    if(localStorage.getItem('is_logged_in')=='true'){
      this.getProfileDetail();
      this.user_id      = this.apiService.decryptData(localStorage.getItem('user_token'),config.ENC_SALT);
      this.subscription = this.SharedService.getObservable().subscribe((res:any)=>{
        this.user_id    = this.apiService.decryptData(localStorage.getItem('user_token'),config.ENC_SALT);	
        this.user_name  = res.user_name
      });
    }else{
      this.user_id = '';
      localStorage.clear();
      this.notifyService.showWarning('Please login to use this feature')
      let currentUrl = this.router.navigateByUrl('/login');
    }

  }

  public profileForm        : FormGroup;
  public changePasswordForm : FormGroup;

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      id: 1,
      class: 'thankModal modal-dialog-centered',
    });
  }

  openModal2(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, {
      id: 2,
      class: 'thankModal modal-dialog-centered',
    });
  }

  closeFirstModal(template: TemplateRef<any>) {
   this.modalService.hide();
    // if (!this.modalRef) {
    //   return;
    // }
  // this.modalService.config.animated = false;
    // this.modalRef.hide();
  } 

   closeModalssss(value) {
    console.log('myTextArea valll-->', value);
     const frmData = new FormData();
    frmData.append("user_name", this.user_name);
    frmData.append("user_email", this.user_email);
    frmData.append("content", value);
    if(value != ''){
       this.spinner.show();
    this.apiService.post('send-reasonmail', frmData,'').subscribe((result:any) => {
      var res;
      res = result;  
      this.spinner.hide();
      if (res.status==true) {
         this.spinner.hide();
         // this.notifyService.showSuccess(res?.message)
         
 this.modalRef2.hide();
    this.modalRef = null;
     this.router.navigateByUrl('/login');
      } else {
         this.spinner.hide();
         this.modalRef2.hide();
    this.modalRef = null;
       this.router.navigateByUrl('/login');
      }
    });
    }
    else{
      this.notifyService.showError('please enter message why you chose to delete your account.');
    }
   
  }

  closeModal(modalId?: number) {
    this.modalService.hide(modalId);
  }

  getProfileDetail(){
    const frmData = new FormData();
		frmData.append("userid", this.user_id);
    this.apiService.profileData(frmData).subscribe((res: any) => {
      if (res.status==true) {
        this.responseData = res.data;
         this.user_name  = this.responseData.user_name;
         this.user_email  = this.responseData.uemail;
        console.log('profile data->',this.responseData)
        this.profileForm.controls['user_name'].setValue(this.responseData.user_name);
        this.profileForm.controls['uemail'].setValue(this.responseData.uemail);
        
        this.profileForm.controls['subscribe_me'].setValue((this.responseData.subscribe_me == 1 ? true : false));
        
        this.profileForm.controls['send_recommened_poem'].setValue((this.responseData.send_recommened_poem == 1 ? true : false));
        
        this.profileForm.controls['send_notification'].setValue((this.responseData.send_notification == 1 ? true : false));
        
      } else {
        this.responseData=[];
        this.notifyService.showError(res?.message);
      }
    });
  }

  ngOnInit(){
    if(localStorage.getItem('is_logged_in')=='true'){
      this.user_id      = this.apiService.decryptData(localStorage.getItem('user_token'),config.ENC_SALT);
      this.getProfileDetail();
      this.subscription = this.SharedService.getObservable().subscribe((res:any)=>{
        this.user_id    = this.apiService.decryptData(localStorage.getItem('user_token'),config.ENC_SALT);	
        this.user_name  = res.user_name
        // this.getProfileDetail();
      });
    }else{
       this.user_id = '';
      localStorage.clear();
      this.notifyService.showWarning('Please login to use this feature')
      let currentUrl = this.router.navigateByUrl('/login');
    }
  }

  initForm() {
     this.profileForm = this.formBuilder.group({
        user_name: ['', Validators.required],
        uemail: ['', [Validators.required, Validators.email]],
        subscribe_me: [false],
        send_recommened_poem: [false],
        send_notification: [false]
    });
    this.changePasswordForm = this.formBuilder.group({
        old_password     : ['', [Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z]).{6,}$/)]],
        password         : ['', [Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z]).{6,}$/)]],
        confirm_password : ['', Validators.required],
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  get formContrl() {
    return this.changePasswordForm.controls;
  }

  onUpdate(){
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
    } 
    this.apiService.profileUpdateData(this.profileForm.value).subscribe((res: any) => {
      console.log('update res profile=>',res.data)
      if (res.status==true) {
        this.responseData = res.data;
        this.SharedService.publishSomeData({user_name:res.data});
        this.notifyService.showSuccess(res?.message)
        if(this.profileForm.value.send_recommened_poem == true || this.profileForm.value.send_notification == true){
           this.router.navigateByUrl('/recommendedpoems');
         
        }
        else{
          this.router.navigateByUrl('/home');
        }
      } else {
        this.responseData=[];
        this.notifyService.showError(res?.message);
         this.router.navigateByUrl('/home');
      }
    });
  }

  submitChangePassword(){
    this.submittedForChangePassword = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.apiService.post('update-password'+'/'+this.user_id, this.changePasswordForm.value,'').subscribe((result:any) => {
      var res;
      res = result;  
      // console.log(res)
      if (res.status==true) {
        this.responseData = res.data;
        this.notifyService.showSuccess(res?.message)
         this.router.navigateByUrl('/home');
      } else {
        this.responseData = [];
        this.notifyService.showError(res?.message);
      }
    });
  }  

  ondeletebtn(template: TemplateRef<any>){
    this.modalService.hide();
     const frmData = new FormData();
    frmData.append("userid", this.user_id);
    this.spinner.show();
    this.apiService.post('delete-account', frmData,'').subscribe((result:any) => {
      var res;
      res = result;  
      this.spinner.hide();
      if (res.status==true) {
         this.spinner.hide();
         // this.notifyService.showSuccess(res?.message)
         this.modalRef2 = this.modalService.show(template, {
            id: 2,
            class: 'thankModal modal-dialog-centered',
          });
         // this.router.navigateByUrl('/login');
      } else {
         this.spinner.hide();
        this.notifyService.showError(res?.message);
      }
    });
  }
  
}
