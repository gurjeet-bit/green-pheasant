import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ApiService } from '../../app/services/api.service'; 
import {config} from '../../app/services/config'
import { FormBuilder,FormGroup,FormControl, Validators } from '@angular/forms';
import {NotificationService} from '../../app/services/notification.service' 
import {ActivatedRoute} from '@angular/router';
import {NgxSpinnerService} from "ngx-spinner";
import {MustMatch} from '../services/must-match.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit {

  public resetPasswordForm : FormGroup;
  submitted = false;
  logged_in_user_data:any;
  user_id:any;
	password:any;
	password_regex:any;
  errors:any=['',null,undefined,false];
	confirm_password:any;
  token:any;
  userid:any;

  constructor(private spinner: NgxSpinnerService,private notifyService : NotificationService,private apiService:ApiService,private formBuilder: FormBuilder,private modalService: BsModalService,private router:Router,private toastr: ToastrService,public activatedRoute: ActivatedRoute) { 
    this.password_regex =	/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/i;
    this.token          = activatedRoute.snapshot.paramMap.get('token'); 
  };

  ngOnInit(): void {
     this.resetPasswordForm = this.formBuilder.group({
        password: ['', [Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z]).{6,}$/), Validators.minLength(6)]],
        confirm_password: ['', Validators.required],
        token:  [this.token]
    },
    {
      validator: MustMatch('password', 'confirm_password'),
    });
  }

  get f() {
    return this.resetPasswordForm.controls;
  }

  onSubmit(){
    this.spinner.show();
    this.submitted = true;
    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    } 
     
    if(this.resetPasswordForm.value.password!=this.resetPasswordForm.value.confirm_password){
      return;
    }

    this.apiService.resetPassword(this.resetPasswordForm.value).subscribe((res: any) => {
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
