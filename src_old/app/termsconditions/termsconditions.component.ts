import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ApiService } from '../../app/services/api.service' 
import {config} from '../../app/services/config'
import {NotificationService } from '../../app/services/notification.service' 
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-termsconditions',
  templateUrl: './termsconditions.component.html',
  styleUrls: ['./termsconditions.component.scss']
})

export class TermsconditionsComponent implements OnInit {

  user_id:any;
  responseData:any;

  constructor(private spinner: NgxSpinnerService,private notifyService : NotificationService,private apiService:ApiService,private modalService: BsModalService,private router:Router,private toastr: ToastrService) {
    // this.hideShowDiv = true;
    this.termCondtion();
  }

  ngOnInit(): void {
  }

  termCondtion(){
    this.user_id = 1;
    this.spinner.show();
    this.apiService.termCondtion(this.user_id).subscribe((res: any) => {
      if (res.status==true) {
        this.responseData = res.data;
        this.spinner.hide();
        // this.notifyService.showSuccess(res.message)
        // console.log(this.responseData,'in');
      } else {
        // console.log('out');
        this.spinner.hide();
        // this.notifyService.showError(res.message)
      }
    });
  }






}
