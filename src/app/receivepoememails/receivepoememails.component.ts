import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ApiService } from '../../app/services/api.service';
import { config } from '../../app/services/config';
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import * as $ from 'jquery';
import { NotificationService } from '../../app/services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-receivepoememails',
  templateUrl: './receivepoememails.component.html',
  styleUrls: ['./receivepoememails.component.scss'],
})
export class ReceivepoememailsComponent implements OnInit {
  modalRef?: BsModalRef;
  flag: any;
  recommend_poem_email: any;
  recommend_poem: any;
  other_email: any;
  hideShowDiv: boolean;
  user_id: any;
  public registerForm: FormGroup;
  submitted = false;
   errors:any=['',null,undefined,false,'null','undefined'];
  is_submit: boolean = false;
  isEmailValidate: boolean = false;
  myForm: FormGroup;
  responseData: any;
  message32: any;

  get rForm() {
    return this.registerForm.controls;
  }

  constructor(
    private spinner: NgxSpinnerService,
    private notifyService: NotificationService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.user_id = this.apiService.decryptData(
      localStorage.getItem('user_token'),
      config.ENC_SALT
    );
    this.getProfileDetail();
    // this.recommend_poem_email = 0;
    this.hideShowDiv = true;
    this.registerForm = this.formBuilder.group({
      urec_email_freq: ['', Validators.required],
      recommend_poem_email: [''],
      other_email: [''],
      user_id: [this.user_id],
      sendPoemVia: ['via_email'],
      recommend_poem: [0],
    });
    this.checkEmailAddressRegistered(1);
  }

  getProfileDetail() {
    const frmData = new FormData();
    frmData.append('userid', this.user_id);
    this.apiService.profileData(frmData).subscribe((res: any) => {
      if (res.status == true) {
        this.responseData = res.data;
        this.spinner.hide();
        console.log('data output=>', this.responseData);
        if(this.responseData.recommend_poem == 0){
          this.registerForm.controls['urec_email_freq'].setValue(
          this?.responseData.urec_email_freq?.toString()
        );
        this.registerForm.controls['recommend_poem_email'].setValue(
            this?.responseData?.recommend_poem_email
        );
        this.registerForm.controls['other_email'].setValue(
          this?.responseData?.other_email
        );
        }
        
        
        // this.registerForm.controls['recommend_poem'].setValue(
        //   this.responseData.recommend_poem
        // );
      } else {
        this.responseData = [];
      }
    });
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.registerForm.controls[controlName];
    // console.log('control=>',control)
    if (!control) {
      return false;
    }
    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  openModal(template: TemplateRef<any>) {
    this.submitted = true;
    console.log(this.registerForm.value.urec_email_freq);
    
    if (this.registerForm.value.urec_email_freq == undefined || this.registerForm.value.urec_email_freq == '') {
      this.notifyService.showError(
        'Please select how many times you want the poem on your email address'
      );
      return;
    }
     if (
      this.registerForm.value.recommend_poem_email == 1 &&
      this.registerForm.value.other_email == null
    ) {
      this.notifyService.showError('Please enter other email address');
      console.log('innnnnnnnnnnnnnnnnnnnnnn')
      return;
    }
 if(this.errors.indexOf(this.registerForm.value.recommend_poem_email) > 0){
      this.notifyService.showError('Please enter email options');
      console.log('innnnnnnnnnnnnnnnnnnnnnn',this.registerForm.value.recommend_poem_email)
      return;
    }

    if (this.registerForm.value.recommend_poem_email == 1) {
      this.registerForm.controls['other_email'].setValidators([
        Validators.required,
        Validators.email,
      ]);
      this.registerForm.controls['other_email'].updateValueAndValidity();
    }

   

    const controls = this.registerForm.controls;
    console.log(this.recommend_poem_email);

    if (this.registerForm.invalid && this.registerForm.value.recommend_poem_email == 1) {
      console.log('if');
      console.log(this.recommend_poem_email);
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      console.log('markAsTouched');
      return;
    } else {
      console.log('outttttttttttttttttttttttttttt');
    }
    // return false;

    this.spinner.show();

       if (this.registerForm.value.recommend_poem_email == 0) {
    this.registerForm.controls['other_email'].setValue(
          this?.responseData?.uemail
        );
    }

    this.apiService
      .post('send-me-a-poem', this.registerForm.value, '')
      .subscribe(
        (result: any) => {
          var res;
          res = result;
          this.notifyService.showSuccess(res.message);
          console.log('get=>', res.testData.message);
          this.message32 = res.testData.message;

          // setTimeout(()=>{
          this.modalRef = this.modalService.show(
            template,
            Object.assign({}, { class: 'thankModal modal-dialog-centered' })
          );
          // }, 1000);
          // this.spinner.hide();
          // this.modalRef = this.modalService.show(
          //   template,
          //   Object.assign({}, { class: 'thankModal modal-dialog-centered' })
          // );
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          this.notifyService.showError('No record found');
        }
      );
  }

  openModal1(template: TemplateRef<any>) {
    this.spinner.show();
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'thankModal modal-dialog-centered' })
    );
    this.spinner.hide();
  }

  closeModal(modalId?: number) {
    this.modalService.hide(modalId);
  }

  useRegisteredEmail(item) {
    console.log(item);
  }

  validateEmail(email: any) {
    const enterEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.isEmailValidate = enterEmail.test(String(email).toLowerCase());
  }

  ngOnInit() {}

//   checkEmailAddressRegistered(item) {
//     console.log('strat', this.registerForm.value.recommend_poem_email);
//     if (this.registerForm.value.recommend_poem_email == 1) {
//       console.log('outhhhhhhhhhhhhhhh');
//       this.registerForm.controls['other_email'].clearValidators();
//       this.registerForm.controls['other_email'].updateValueAndValidity();
//       console.log('out', this.registerForm.value.recommend_poem_email);
//       this.recommend_poem_email = 0;
//     } else {
//       console.log('inllllllllllll');
//       this.registerForm.controls['other_email'].setValidators([
//         Validators.required,
//         Validators.email,
//       ]);
//       this.registerForm.controls['other_email'].updateValueAndValidity();
//       this.recommend_poem_email = 1;
//       console.log('update', this.registerForm.controls);
//     }
//   }
// }
checkEmailAddressRegistered(item){
  console.log('strat',this.registerForm.value.recommend_poem_email)
  if(this.registerForm.value.recommend_poem_email==0){
    console.log('inllllllllllll')
    this.registerForm.controls['other_email'].setValidators([Validators.required, Validators.email]);
    this.registerForm.controls['other_email'].updateValueAndValidity();
    // this.recommend_poem_email = 0;
    console.log('update',this.registerForm.controls)
    console.log(this.recommend_poem_email)
  }else{
    console.log('outhhhhhhhhhhhhhhh')
    this.registerForm.controls['other_email'].clearValidators();
    this.registerForm.controls['other_email'].updateValueAndValidity();
    console.log('out',this.registerForm.value.recommend_poem_email)
    // this.recommend_poem_email = 0;
    console.log(this.recommend_poem_email)
  }
}
}
