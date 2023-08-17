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

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss'],
})

export class ContactusComponent implements OnInit {

  modalRef?: BsModalRef;
  hideShowDiv: boolean;  
  public contactForm : FormGroup;
  submitted = false;
  name:any;
	email:any;
	message:any;
	errors:any=['',null,undefined,false];
	is_submit:boolean=false;
	isLoggedIn = false;

  constructor(private notifyService : NotificationService,private apiService:ApiService,private formBuilder: FormBuilder,private modalService: BsModalService,private router:Router,private toastr: ToastrService) {
    this.hideShowDiv = true;
    // this.reg_exp 				= /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 	 	// this.password_regex	=	/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/i;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {
         class: 'thankModal modal-dialog-centered' 
        })
    );

  }

  hidePopup(){
    this.modalRef.hide();
    location.reload();
  }

  closeModal(modalId?: number) {
    this.modalService.hide(modalId);
  }

  ngOnInit() {
     var re = /^\s*(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\s*$/;
     this.contactForm = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern(re)]],
        message: ['', [Validators.required,]]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

   onSubmit(template: TemplateRef<any>){
    console.log('here',this.contactForm.value)
    this.submitted = true;
    console.log(this.contactForm)
    // stop here if form is invalid
    if (this.contactForm.invalid) {
      return;
    } 

    this.apiService.contact(this.contactForm.value).subscribe((res: any) => {
      if (res.status==true) {
        this.notifyService.showSuccess(res.message)
        this.submitted = false;
        this.openModal(template)

        this.contactForm.reset();    
        // location.reload();

      } else {
        this.notifyService.showError(res.message)
      }
    });
  }


}
