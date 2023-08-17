import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ApiService } from '../../app/services/api.service' 
import {config} from '../../app/services/config'
import {FormControl, Validators,FormBuilder,FormGroup,ReactiveFormsModule } from '@angular/forms';
import * as $ from 'jquery';
import {NotificationService } from '../../app/services/notification.service' 
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-recievepoembyboth',
  templateUrl: './recievepoembyboth.component.html',
  styleUrls: ['./recievepoembyboth.component.scss']
})

export class RecievepoembybothComponent implements OnInit {

  modalRef?: BsModalRef;
  flag: any;
  recommend_poem_email:any;
  recommend_poem:any;
  other_email:any;
  hideShowDiv: boolean;
  user_id:any;
  registremail:any;
  public bothRecommendForm : FormGroup;
  public poemRecommendForMobile : FormGroup;

  submitted = false;
  errors:any=['',null,undefined,false,'null','undefined'];
  is_submit:boolean=false;
  isEmailValidate: boolean = false;
  is_next: boolean = false;
  is_back: boolean = false;
  urec_push_freq:any;
  myForm: FormGroup;
  responseData:any;

  get rForm() {
    return this.bothRecommendForm.controls;
  }
  
  get pForm() {
    return this.poemRecommendForMobile.controls;
  }

  closeModal(modalId?: number) {
    this.modalService.hide(modalId);
  }

  constructor(private spinner: NgxSpinnerService,private notifyService : NotificationService,private apiService:ApiService,private formBuilder: FormBuilder,private modalService: BsModalService,private router:Router,private toastr: ToastrService) {
    this.user_id = this.apiService.decryptData(localStorage.getItem('user_token'),config.ENC_SALT);
    this.getProfileDetail();
    this.recommend_poem_email = 0;
    this.hideShowDiv = true;
    this.bothRecommendForm = this.formBuilder.group({
        urec_email_freq: ['', Validators.required],
        recommend_poem_email: [''],
        // other_email: ['', [Validators.required, Validators.email]],
        other_email: [''],
        user_id    : [this.user_id],
        sendPoemVia: ['via_email'],
    });
    
    this.poemRecommendForMobile = this.formBuilder.group({
        urec_push_freq: ['', Validators.required],
        user_id    : [this.user_id],
        sendPoemVia: ['via_mobile']
    });

  }

  ngOnInit(): void {
  }

  getProfileDetail(){
    const frmData = new FormData();
		frmData.append("userid", this.user_id);
    this.apiService.profileData(frmData).subscribe((res: any) => {
      if (res.status==true) {
        this.responseData = res.data;
        this.registremail = this.responseData.uemail;
        console.log('profile',this.responseData);
        
        if(this.responseData.recommend_poem == 2){
          this.bothRecommendForm.controls['other_email'].setValue(this.responseData.other_email);
        this.bothRecommendForm.controls['urec_email_freq'].setValue(this.responseData.urec_email_freq.toString());
        this.bothRecommendForm.controls['recommend_poem_email'].setValue(this.responseData.recommend_poem_email);
        
        // this.bothRecommendForm.controls['recommend_poem'].setValue(this.responseData.recommend_poem);
        }
      } else {
        this.responseData=[];
      }
    });
  }


  checkEmailAddressRegistered(item){
    console.log('strat',this.bothRecommendForm.value.recommend_poem_email)
    if(this.bothRecommendForm.value.recommend_poem_email==0){
      console.log('in',this.bothRecommendForm.value.recommend_poem_email)
      this.bothRecommendForm.controls['other_email'].setValidators([Validators.required, Validators.email]);
      this.bothRecommendForm.controls['other_email'].updateValueAndValidity();
    }else{
      this.bothRecommendForm.controls['other_email'].clearValidators();
      this.bothRecommendForm.controls['other_email'].updateValueAndValidity();
      console.log('out',this.bothRecommendForm.value.recommend_poem_email)
    }
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.bothRecommendForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  firstStep() {  
    this.submitted = true;
    console.log(this.bothRecommendForm.value.recommend_poem_email)
    if(this.bothRecommendForm.value.urec_email_freq==''){
       console.log('firsttttt')
      this.notifyService.showError('Please select how many times you want the poem on your email adddress');
    }
    if(this.bothRecommendForm.value.recommend_poem_email==1 && this.bothRecommendForm.value.other_email==''||null){
    // if(this.bothRecommendForm.value.recommend_poem_email==1){
       console.log('2nddddddd')
       this.notifyService.showError('Please select other email address');
    }
      if(this.errors.indexOf(this.bothRecommendForm.value.recommend_poem_email) >= 0){
      this.notifyService.showError('Please enter email options');
      console.log('innnnnnnnnnnnnnnnnnnnnnn',this.bothRecommendForm.value.recommend_poem_email)
      return;
    }
    // stop here if form is invalid
    // if (this.bothRecommendForm.invalid) {
    //    console.log('3rddddddddddddd')
    //   return;
    // } 
    this.is_next=true;
    if(this.responseData.recommend_poem == 2){  
    this.poemRecommendForMobile.controls['urec_push_freq'].setValue(this.responseData.urec_push_freq.toString());
  }
}

   sendnotify(template: TemplateRef<any>){
    // const controls = this.poemRecommendForMobile.controls;
      if(this.poemRecommendForMobile.value.urec_push_freq==''){
       console.log('firsttttt')
      this.notifyService.showError('Please select how many times you want the poem on your mobile');
   return;
    }
    const frmData = new FormData();
    frmData.append("id", localStorage.getItem('green_userid'));
    frmData.append("mobile_tym",this.poemRecommendForMobile.controls['urec_push_freq'].value);
    frmData.append("email_tym",this.bothRecommendForm.controls['urec_email_freq'].value);
    // frmData.append("email",this.bothRecommendForm.controls['other_email'].value);
    if(this.bothRecommendForm.value.recommend_poem_email==0){
      console.log('registremailll');
      frmData.append("email",this.registremail);
    }
    else{
      frmData.append("email",this.bothRecommendForm.controls['other_email'].value);
    }
    
     
    this.apiService.post('sendbothpoemonfcm',frmData,'').subscribe((res:any) => {
      if (res.status==true) {
        // this.spinner.hide();
        // this.responseData = res.data;
        console.log('randompoemdata',res);
        this.othersubmit();
        this.notifyService.showSuccess(res.message);
        // this.router.navigateByUrl('/');
         this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'thankModal modal-dialog-centered' })
    );

        
      } else {
        // this.spinner.hide();
        console.log('err');
      }
    });
  }


    othersubmit() {
    this.spinner.show();
    console.log('firstForm',this.bothRecommendForm.value)
    console.log('SecondForm',this.poemRecommendForMobile.value)
    this.submitted = true;

    if(this.poemRecommendForMobile.value.urec_email_freq==''){
      this.notifyService.showError('Please select how many times you want the poem on your email adddress');
    }

    if(this.poemRecommendForMobile.value.recommend_poem_email==1){
       this.notifyService.showError('Please select other email address');
    }
    // stop here if form is invalid
    if (this.poemRecommendForMobile.invalid) {
      return;
    }

     if (this.bothRecommendForm.value.recommend_poem_email == 0) {
    this.bothRecommendForm.controls['other_email'].setValue(
          this.registremail
        );
    }

    const dict = {
      firstForm:this.bothRecommendForm.value,
      secondForm:this.poemRecommendForMobile.value,
      sendPoemVia:'both_mobile_email',
      recommend_poem:2
    };

    this.apiService.post('send-me-a-poem',dict,'').subscribe((result:any) => {
      var res;
      res = result;  
      this.spinner.hide();
    },
    err => {
        this.spinner.hide();
    });


  }


  openModal(template: TemplateRef<any>) {
    this.spinner.show();
    console.log('firstForm',this.bothRecommendForm.value)
    console.log('SecondForm',this.poemRecommendForMobile.value)
    this.submitted = true;

    if(this.poemRecommendForMobile.value.urec_email_freq==''){
      this.notifyService.showError('Please select how many times you want the poem on your email adddress');
    }

  
    // stop here if form is invalid
    if (this.poemRecommendForMobile.invalid) {
      return;
    }

    this.is_next = true;

    const dict = {
      firstForm:this.bothRecommendForm.value,
      secondForm:this.poemRecommendForMobile.value,
      sendPoemVia:'both_mobile_email',
      recommend_poem:2
    };

    this.apiService.post('send-me-a-poem',dict,'').subscribe((result:any) => {
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

  backToFirstPage(){
    this.is_next=false;  
  }



}




