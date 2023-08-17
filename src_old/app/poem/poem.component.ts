import { Component, OnInit } from '@angular/core';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { config } from '../services/config';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import * as $ from 'jquery';
import { GlobalFooService } from '../services/globalFooService.service';
import { NotificationService } from '../services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-poem',
  templateUrl: './poem.component.html',
  styleUrls: ['./poem.component.scss'],
})
export class PoemComponent implements OnInit {
  faChevronRight = faChevronRight;
  isShown: boolean = false;

  toggleShow() {
    this.isShown = !this.isShown;
  }
  poemType: any;
  flag: any;
  poem_id: any;
  poemData: any;
  userdataa: any = [];
  poemData1: any;
  errors: any = ['', null, undefined, false];
  user_id: any;
   theme:any = 'Love';
  mood:any = 'Sunny';

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifyService: NotificationService,
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.user_id = this.apiService.decryptData(
      localStorage.getItem('user_token'),
      config.ENC_SALT
    );
    this.flag = 1;

     var selectedtype = localStorage.getItem('poemselected_type');
    // var poemtype = localStorage.getItem('poemselected_type');
    console.log('first',selectedtype);
    console.log('second',localStorage.getItem('poemType'));
    if(selectedtype){
      console.log('first1');
      this.flag = selectedtype;
    }
    else{
      console.log('first2');
       this.flag = 1;
    }
     if(selectedtype == '2'){
      console.log('first3');
        this.flag = 2;
          this.theme=localStorage.getItem('poemType');
    }
    else if(selectedtype == '3'){
      console.log('first4');
      this.flag = 3;
          this.mood=localStorage.getItem('poemType');
    }
    else{
      console.log('first5');
     
          this.poemType = 'any';
       this.flag = 1;
    }

    this.poem_id = activatedRoute.snapshot.paramMap.get('id');
    this.poemDetail();
    this.getProfileDetail();
  }

  ngOnInit() {}

  logoutToLogin() {
    this.notifyService.showError('Please login');
    this.router.navigateByUrl('/home');
  }

  getProfileDetail() {
    const frmData = new FormData();
    frmData.append('userid', this.user_id);
    this.apiService.profileData(frmData).subscribe((res: any) => {
      if (res.status == true) {
        this.userdataa = res.data;
        console.log('profile data->', this.userdataa);
      } else {
        this.userdataa = [];
        // this.notifyService.showError(res?.message);
      }
    });
  }

  poemDetail() {
    const frmData = new FormData();
    if (this.user_id) {
      frmData.append('userid', this.user_id);
    } else {
      this.user_id = 0;
      frmData.append('userid', this.user_id);
    }
    frmData.append('poem_id', this.poem_id);

    this.spinner.show();
    this.apiService
      .post('poem/' + this.poem_id, frmData, '')
      .subscribe((result: any) => {
        var res;
        res = result;
        this.spinner.hide();
        if (res.status == true) {
          this.poemData = res.data;
          console.log(this.poemData, this.user_id);
        } else {
          this.poemData = [];
        }
      });
  }

  sourceUrl(url) {
    if(url.match("http")){
       window.open(url);
    }
    else{
      console.log('invalid');
      window.open('https://'+url);
    }
   
     // window.location.href = 'https://www.google.com';
  }

  linkUrl(k_url) {
    window.open(k_url);
  }

  addToCollection(item_id) {
    this.spinner.show();
    const frmData = new FormData();
    frmData.append('item_id', item_id);
    frmData.append('user_id', this.user_id);

    this.apiService.post('add-to-collection', frmData, '').subscribe(
      (result: any) => {
        var res;
        res = result;
        this.spinner.hide();
        console.log('get', res.status);
        if (res.status == true) {
          this.notifyService.showSuccess(res.message);
          this.router.navigateByUrl('/mycollection');
        } else {
          this.notifyService.showError('res.message');
          this.router.navigateByUrl('/home');
        }
      },
      (err) => {
        this.spinner.hide();
        this.notifyService.showError('No record found');
        this.router.navigateByUrl('/home');
      }
    );
  }

  gotoanthrpoem() {
    this.spinner.show();
    const frmData = new FormData();
   frmData.append("flag", this.flag);
     localStorage.setItem('poemselected_type', this.flag);
    if(this.flag==1){
      this.poemType = 'any';
      localStorage.setItem('poemType', this.poemType);
    } else if(this.flag==2){
      frmData.append("poemType", this.theme); 
      localStorage.setItem('poemType', this.theme);
    } else{
      frmData.append("poemType", this.mood); 
      localStorage.setItem('poemType', this.mood);
    }
    if (this.user_id) {
      frmData.append('userid', this.user_id);
    } else {
      this.user_id = 0;
      frmData.append('userid', this.user_id);
    }

    this.apiService.post('recommend-poem', frmData, '').subscribe(
      (result: any) => {
        var res;
        res = result;
        console.log('get', res.status);
        if (res.status == true) {
          this.spinner.hide();
          this.poemData1 = res.data;
          this.router.navigateByUrl(
            '/search-poem-detail/' + this.poemData1.itemid
          );
        } else {
          this.notifyService.showError('No record found');
          this.router.navigateByUrl('/home');
        }
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        this.notifyService.showError('No record found');
        this.router.navigateByUrl('/home');
      }
    );
  }

  removeFromCollection(item_id) {
    this.spinner.show();
    const frmData = new FormData();
    frmData.append('item_id', item_id);
    frmData.append('user_id', this.user_id);

    this.apiService.post('remove-from-collection', frmData, '').subscribe(
      (result: any) => {
        var res;
        res = result;
        this.spinner.hide();
        console.log('get', res.status);
        if (res.status == true) {
          this.notifyService.showSuccess(res.message);
          this.router.navigateByUrl('/mycollection');
          // this.router.navigateByUrl('/search-poem-detail/'+this.poemData.itemid);
        } else {
          this.notifyService.showError('res.message');
          this.router.navigateByUrl('/searchmeapoem');
        }
      },
      (err) => {
        this.spinner.hide();
        this.notifyService.showError('No record found');
        this.router.navigateByUrl('/searchmeapoem');
      }
    );
  }

  deleteFromCollection(item_id) {
    this.spinner.show();
    this.apiService.post('deletePoem/' + item_id, '', '').subscribe(
      (result1: any) => {
        var res1;
        res1 = result1;
        if (res1.status == true) {
          this.spinner.hide();
          this.notifyService.showSuccess(res1.message);
          this.router.navigateByUrl('/mycollection');
        } else {
          this.spinner.hide();
          this.notifyService.showError('res1.message');
          this.router.navigateByUrl('/searchmeapoem');
        }
      },
      (err) => {
        this.spinner.hide();
        this.notifyService.showError('No record found');
        this.router.navigateByUrl('/searchmeapoem');
      }
    );
  }
}
