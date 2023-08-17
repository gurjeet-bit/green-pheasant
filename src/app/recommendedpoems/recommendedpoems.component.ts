import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { config } from '../services/config';
import { FormBuilder, FormGroup, Validators,FormControl, FormArray } from '@angular/forms';
import * as $ from 'jquery';
import { GlobalFooService } from '../services/globalFooService.service';
import { NotificationService } from '../services/notification.service';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-recommendedpoems',
  templateUrl: './recommendedpoems.component.html',
  styleUrls: ['./recommendedpoems.component.scss'],
})

export class RecommendedpoemsComponent implements OnInit {
   user_id:any;
  responseData:any;
  isShown: boolean = false;
  isShown1: boolean = false;
  isShown2: boolean = false;
  toggleShow() {
    this.isShown = !this.isShown;
    this.isShown1 = false;
    this.isShown2 = false;
  }
  toggleShow1() {
    this.isShown1 = !this.isShown1;
    this.isShown = false;
    this.isShown2 = false;
  }
  toggleShow2() {
    this.isShown2 = !this.isShown2;
    this.isShown = false;
    this.isShown1 = false;
  }
  modalRef?: BsModalRef;
  hideShowDiv: boolean;
  constructor(private modalService: BsModalService,private SharedService: GlobalFooService,private spinner: NgxSpinnerService,private notifyService : NotificationService,private apiService:ApiService,private fb: FormBuilder,private router:Router,private toastr: ToastrService) {
    this.hideShowDiv = true;

    this.spinner.show();

    if(localStorage.getItem('is_logged_in')=='true'){ 
      this.user_id    = this.apiService.decryptData(localStorage.getItem('user_token'),config.ENC_SALT);
        const frmData = new FormData();
    frmData.append("userid", this.user_id);
    this.apiService.profileData(frmData).subscribe((res: any) => {
      if (res.status==true) {
        this.responseData = res.data;
        console.log('userprofiledata11',this.responseData);
        
      } else {
        this.responseData=[];
      }
    });

    }else{
     
    }
    
    // if(localStorage.getItem('is_logged_in')=='true'){ 

    // }else{
    //   localStorage.clear();
    //   // this.SharedService.publishSomeData('');
    //   this.notifyService.showWarning('Please login to use this feature')
    //   let currentUrl = this.router.navigateByUrl('/login');
    // }

  }
  onemailclick(){
if(localStorage.getItem('is_logged_in')=='true'){ 
      this.router.navigateByUrl('/receivepoememails');
    }else{
      localStorage.clear();
      // this.SharedService.publishSomeData('');
      this.notifyService.showWarning('Please login to use this feature')
      let currentUrl = this.router.navigateByUrl('/login');
    }
  }

  onphoneclick(){
    if(localStorage.getItem('is_logged_in')=='true'){ 
      this.router.navigateByUrl('/receivepoemnotifications');
    }else{
      localStorage.clear();
      // this.SharedService.publishSomeData('');
      this.notifyService.showWarning('Please login to use this feature')
      let currentUrl = this.router.navigateByUrl('/login');
    }
  }

  onbothclick(){
    if(localStorage.getItem('is_logged_in')=='true'){ 
       this.router.navigateByUrl('/receivepoembyboth');
    }else{
      localStorage.clear();
      // this.SharedService.publishSomeData('');
      this.notifyService.showWarning('Please login to use this feature')
      let currentUrl = this.router.navigateByUrl('/login');
    }
  }

  openModal(template: TemplateRef<any>) {
    this.spinner.hide();
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
