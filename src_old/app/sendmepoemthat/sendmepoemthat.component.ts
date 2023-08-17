import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ApiService } from '../../app/services/api.service'; 
import {config} from '../../app/services/config';
import {NotificationService } from '../../app/services/notification.service' ;
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-sendmepoemthat',
  templateUrl: './sendmepoemthat.component.html',
  styleUrls: ['./sendmepoemthat.component.scss']
})
export class SendmepoemthatComponent implements OnInit {

  user_id:any;

  constructor(private spinner: NgxSpinnerService, private notifyService : NotificationService,private apiService:ApiService,private router:Router,private toastr: ToastrService) {
    if(localStorage.getItem('is_logged_in')=='true'){ 
      this.user_id = this.apiService.decryptData(localStorage.getItem('user_token'),config.ENC_SALT);
    }else{
      localStorage.clear();
      this.notifyService.showWarning('Please login to use this feature')
      let currentUrl = this.router.navigateByUrl('/login');
    }
  }

  ngOnInit(): void {
  }

  sendMePoem(text){
    // this.spinner.hide();
    this.spinner.show();
    const frmData = new FormData();
		frmData.append("userid", this.user_id);
		frmData.append("send_me_poems", text);
    this.apiService.post('send-me-poem-email',frmData,'').subscribe((result2:any) => {
      var res2;
      res2 = result2;  
      console.log(res2)
      if (res2.status==true) {
        this.spinner.hide();
        this.notifyService.showSuccess(res2?.message)
        this.router.navigateByUrl('/home');
      } else {
        this.notifyService.showError('Something went wrong')
        this.router.navigateByUrl('/home');
      }
    });

  }

}
