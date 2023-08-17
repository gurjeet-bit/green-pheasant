import { Component, OnInit,TemplateRef,ChangeDetectionStrategy  } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { config } from '../services/config';
import { FormBuilder, FormGroup, Validators,FormControl, FormArray } from '@angular/forms';
import * as $ from 'jquery';
import { NotificationService } from '../services/notification.service';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-searchmeapoem',
  templateUrl: './searchmeapoem.component.html',
  styleUrls: ['./searchmeapoem.component.scss']
})

export class SearchmeapoemComponent implements OnInit {

  faChevronRight = faChevronRight;
  isShown:  boolean = false;
  isShown1: boolean = false;
  selected_index:any=-1;

  toggleShow() {
    this.isShown = !this.isShown;
  }

  toggleShow1(i) {
    if(this.selected_index==i){
        this.selected_index=-1;
    }else{
      this.selected_index=i;
    }
  }

  searchedValue:any;
  poemList:any = [];
  modalRef?: BsModalRef;
  flag: any;
  hideShowDiv: boolean;
	errors:any=['',null,undefined,false];
  user_id:any;
  poemIndex:any;
  poemId :any;
  next : any=0;
  offset : any=4;
  isLoaded: any = false;

  constructor(private spinner: NgxSpinnerService,private modalService: BsModalService,private notifyService : NotificationService,private apiService:ApiService,private fb: FormBuilder,private router:Router,private toastr: ToastrService) {
    this.user_id = this.apiService.decryptData(localStorage.getItem('user_token'),config.ENC_SALT);
    localStorage.removeItem('poemselected_type'); 
    localStorage.removeItem('poemType'); 
  }

  ngOnInit(): void {
  }

  getInnerText(el) {
    return el.innerText;
  }

  openModal(template: TemplateRef<any>,poem_id,index) {
    // console.log(poem_id,index)  
    this.poemId    =poem_id;
    this.poemIndex =index;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'thankModal modal-dialog-centered' })
    );
  }

  confirmedDelete(){
    this.apiService.post('deletePoem/'+this.poemId,'','').subscribe((result1:any) => {
      var res1;
      res1 = result1;  
      this.poemList.splice(this.poemIndex,1)
      this.modalRef?.hide();
      this.notifyService.showSuccess(res1.message)
      this.router.navigateByUrl('/mycollection');
    });  
  }

  clickedOut(event) {
    if(event.target.className == "hidecollection") {
       this.modalRef?.hide();
    }
  }

  closeModal(modalId?: number) {
    this.modalService.hide(modalId);
  }

  searchPoem(event: any){
    console.log('length of event ->',event.length);
    if(event.length>2 && event.length!=0){
      // setTimeout(()=>{   
        this.spinner.show();
        // console.log(event);
        const frmData = new FormData();
        frmData.append("searchedValue",event);  
        frmData.append("user_id",this.user_id);  
        this.apiService.post('get-all-poem',frmData,'').subscribe((result1:any) => {
          var res1;
          res1 = result1;  
          this.spinner.hide();
          this.isLoaded = true;
          this.poemList = res1.data;
          // console.log('searched result =>>>',this.poemList);
        },
        err => {
          this.spinner.hide();
        });   
      // },1000);
    }else{
      if(event.length<2){
        this.poemList=[];
      }
      this.poemList=[];
      // console.log('elseeeeee',event.length,this.poemList)
    }
  }


  loadMore() {
  //  console.log('Done offset',this.offset);
    if(this.next>0){
      setTimeout(() => {
        $('.loadMoreButton').show();
        const frmData = new FormData();
        frmData.append("id",  this.user_id); 
        frmData.append("offset",  this.offset); 
        this.apiService.post('load-more-poem',frmData,'').subscribe((result:any) => {
          var res;
          res = result;
          // console.log('load more result status',res.status);
          if(res.status==true){
            // console.log('in',res.data.result.length);
            if(res.data.result.length>0){
              this.poemList = this.poemList.concat(res.data.result);
              this.next=res.data.next;
              this.offset=res.data.offset;
              if(res.data.next == 0){
                $('.loadMoreButton').hide();
              }
            }
          } else{
          } 
        });  
      }, 500);
    }else{
      $('.loadMoreButton').hide();
    }
  }


}
