import { Component, OnInit,TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef,ModalDirective  } from 'ngx-bootstrap/modal';
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

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})

export class EmailVerificationComponent implements OnInit {
  @ViewChild("template", { static: true }) template: TemplateRef<any>;

  token:any;
  templateUrl:any;
  mailtype:any;

  constructor(private spinner: NgxSpinnerService,private notifyService : NotificationService,private apiService:ApiService,private formBuilder: FormBuilder,private modalService: BsModalService,private router:Router,private toastr: ToastrService,public activatedRoute: ActivatedRoute) { 
    this.token  = activatedRoute.snapshot.paramMap.get('token');
    this.mailtype  = activatedRoute.snapshot.paramMap.get('type');
    this.checkTokenVerification(this.token)
  };

  ngOnInit(): void {
   
  }

  modalRefHide(){
    this.modalService.hide();
    if(this.mailtype == 'afterregister'){
        const frmData1 = new FormData();
        frmData1.append('user_id', this.token);
        this.apiService.post('send-welcomemail', frmData1, '').subscribe((result2: any) => {
            var res2;
            res2 = result2;
            console.log(res2);

            this.spinner.hide();
            console.log(res2);
           
          });
    this.router.navigateByUrl('/login');
    }
    else{
       this.router.navigateByUrl('/home');
    }
  }

  checkTokenVerification(token){
    // return false;
    this.spinner.show();
    // this.apiService.emailVerification(token).subscribe((res: any) => {
    //   if (res.status==true) {
    //     this.spinner.hide();
    //     this.modalService.show(this.template);
    //     this.notifyService.showSuccess(res.message)
    //   } else {
    //     this.notifyService.showError(res.message)
    //     setTimeout(function(){
    //       console.log('hi')
    //     },2000);
    //     this.router.navigateByUrl('/home');
    //   }
    // },
    // err => {
    //   this.spinner.hide();
    // });  
    

    ///
    const frmData = new FormData(); 
    frmData.append("token", token);
    this.apiService.post('user-email-verification'+'/'+token,frmData,'').subscribe((result:any) => {
      var res;
      res = result;  
      // this.spinner.hide();
      if (res.status==true) {
        this.spinner.hide();
        // this.modalService.show(this.template);
        this.notifyService.showSuccess(res.message)
        var self = this;
         setTimeout(function(){
           self.router.navigateByUrl('/home');
        },3000);
       
      } else {
        this.notifyService.showError(res.message)
        setTimeout(function(){
          console.log('hi')
        },3000);
        this.router.navigateByUrl('/login');
      }
    },
    err => {
        this.spinner.hide();
        this.notifyService.showError('No record found')
        this.router.navigateByUrl('/login');
    }); 
    
  }

}
