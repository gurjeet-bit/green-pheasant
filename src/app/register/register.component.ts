import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ApiService } from '../../app/services/api.service' 
import {config} from '../../app/services/config'
import { FormBuilder,FormGroup,FormControl, Validators } from '@angular/forms';
import * as $ from 'jquery';
import {NotificationService } from '../../app/services/notification.service' 
import { NgxSpinnerService } from "ngx-spinner";
import {MustMatch} from '../services/must-match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit {
  public registerForm : FormGroup;
  submitted:boolean = false;

  modalRef?: BsModalRef;
  hideShowDiv: boolean;

  user_name:any;
	uemail:any;
	password:any;
	password_regex:any;
	reg_exp:any;
	errors:any=['',null,undefined,false];
	confirm_password:any;
	is_submit:boolean=false;
	isLoggedIn = false;
	remember_me:any;
	subscribe_me:any;
	send_recommened_poem:any;
	send_notification:any;
  isEmailValidate: boolean = false;
  countries:any;
  ucountry_id:any;
  selected_country:any;
  
  constructor(private spinner: NgxSpinnerService,private notifyService : NotificationService,private apiService:ApiService,private formBuilder: FormBuilder,private modalService: BsModalService,private router:Router,private toastr: ToastrService) {
    this.getAllCountry();
    this.hideShowDiv = true;
    this.password_regex	= /^(?=.\d)(?=.[!@#$%^&])(?=.[a-z])(?=.*[A-Z]).{6,}$/;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'thankModal modal-dialog-centered' })
    );
  }

  closeModal(modalId?: number) {
    this.modalService.hide(modalId);
  }

  validateEmail(email: any) {
    const enterEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.isEmailValidate = enterEmail.test(String(email).toLowerCase());
  }

  ngOnInit(){
    this.registerForm = this.formBuilder.group({
        user_name: ['', Validators.required],
        uemail: ['', [Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
        ucountry_id: ['', Validators.required],
        remember_me: [false],
        subscribe_me: [false],
        send_recommened_poem: [false],
        password: ['', [Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z]).{6,}$/), Validators.minLength(6)]],
        confirm_password: ['', Validators.required],
        send_notification: [false]
      },
      {
        validator: MustMatch('password', 'confirm_password'),
      });
  }

  get f() {
    return this.registerForm.controls;
  }

  getAllCountry(){
    this.apiService.post('get-all-country','','').subscribe((result:any) => {
      if (result.status==true) {
        this.countries = result.data;
      } else {
      }
    });
  }

  changeWebsite(data:any){
    this.selected_country =data.value; 
  }

  onSubmit(template: TemplateRef<any>){
    this.submitted = true;
    if (!this.registerForm.valid) {
      return false; 
    } 

    this.spinner.show();
    this.registerForm.controls['ucountry_id'].setValue(this.selected_country);
    this.apiService.register(this.registerForm.value).subscribe((res: any) => {
      if (res.status==true) {
        console.log(this.registerForm.value);
        this.spinner.hide();
        this.notifyService.showSuccess(res.message)
        console.log("hey");
        // this.openModal(template)
        console.log("Hi");
        this.router.navigateByUrl('/login');
      } else {
        this.notifyService.showError(res.message)
      }
    },
    err => {
      this.spinner.hide();
    });   
  }

  

  
}
