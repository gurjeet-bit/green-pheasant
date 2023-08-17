import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ApiService } from '../../app/services/api.service'; 
import {config} from '../../app/services/config'
import { FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms';
import {NotificationService } from '../../app/services/notification.service' 
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent implements OnInit {

  public forgotPasswordForm : FormGroup;
  submitted = false;
  logged_in_user_data:any;
  user_id:any;

  constructor(private spinner: NgxSpinnerService,private notifyService : NotificationService,private apiService:ApiService,private formBuilder: FormBuilder,private modalService: BsModalService,private router:Router,private toastr: ToastrService) { 
    
  }

  ngOnInit(): void {
     this.forgotPasswordForm = this.formBuilder.group({
        uemail: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  onSubmit(){
    this.spinner.show();
    this.submitted = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    } 
    this.apiService.forgotPassword(this.forgotPasswordForm.value).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status==true) {
        this.notifyService.showSuccess(res.message)
        this.router.navigateByUrl('/home');
      } else {
        this.notifyService.showError(res.message)
      }
    },
    err => {
      this.spinner.hide();
    });   
  }

}
