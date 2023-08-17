import { Component, OnInit } from '@angular/core';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
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
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})

export class AboutusComponent implements OnInit {

  oneAtATime = true;
  isFirstOpen = true;
  isContentOpen: boolean = false;
  panelClass = true;
  responseData:any;
  user_id:any;
  aboutUsImage:any;
  imageBaseUrl = config.MAIN_LINK;

  constructor(private spinner: NgxSpinnerService,private notifyService : NotificationService,private apiService:ApiService,private modalService: BsModalService,private router:Router,private toastr: ToastrService) {
    this.aboutUs();
  }

  ngOnInit(): void {
  }

  aboutUs() {
    this.spinner.show();
    this.user_id=1;
    this.apiService.aboutUs(this.user_id).subscribe((res: any) => {
      if (res.status==true) {
        this.responseData = res.data;
        this.spinner.hide();
        // console.log(this.imageBaseUrl+'/aboutUsImage/'+this.responseData?.initiator_image);
        // console.log(this.imageBaseUrl+'/aboutUsImage/'+this.responseData?.developer_image);
        // this.notifyService.showSuccess(res.message)
        // console.log(this.responseData,'in');
      } else {
        this.spinner.hide();
        // console.log('out');
        // this.notifyService.showError(res.message)
      }
      this.spinner.hide();
    });
  }

}


