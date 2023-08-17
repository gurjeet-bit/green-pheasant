import { Component, OnInit, TemplateRef } from '@angular/core';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { config } from '../services/config';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import * as $ from 'jquery';
import { GlobalFooService } from '../services/globalFooService.service';
import { NotificationService } from '../services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FilterPipe } from 'ngx-filter-pipe';

@Component({
  selector: 'app-mycollection',
  templateUrl: './mycollection.component.html',
  styleUrls: ['./mycollection.component.scss'],
})
export class MycollectionComponent implements OnInit {
  faChevronRight = faChevronRight;
  isShown: boolean = false;
  isShown1: boolean = false;
  selected_index: any = -1;

  toggleShow() {
    this.isShown = !this.isShown;
  }

  toggleShow1(i) {
    this.isShown1 = !this.isShown1;
    if (this.selected_index == i) {
      this.selected_index = -1;
    } else {
      this.selected_index = i;
      console.log(this.selected_index, 'Over');
    }
  }

  modalRef?: BsModalRef;
  flag: any;
  hideShowDiv: boolean;
  errors: any = ['', null, undefined, false, 'NULL'];
  user_id: any;
  poemData: any = [];
  userdataa: any = [];
  poemIndex: any;
  poemId: any;
  next: any = 0;
  offset: any = 4;
  searchedValue: string;
  isLoaded: any = false;
  theme: any = 'Love';
  mood: any = 'Sunny';
  poemType: any;

  constructor(
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private SharedService: GlobalFooService,
    private notifyService: NotificationService,
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.flag = 1;
    this.hideShowDiv = true;
    if (localStorage.getItem('is_logged_in') == 'true') {
      this.user_id = this.apiService.decryptData(
        localStorage.getItem('user_token'),
        config.ENC_SALT
      );
      this.poemList();
      this.getProfileDetail();
    } else {
      localStorage.clear();
      // this.SharedService.publishSomeData('');
      this.notifyService.showWarning(
        'Please sign in to add poems to your collection'
      );
      let currentUrl = this.router.navigateByUrl('/login');
    }
     localStorage.removeItem('poemselected_type'); 
      localStorage.removeItem('poemType'); 
  }

  openModal(template: TemplateRef<any>, poem_id, index) {
    console.log(poem_id, index);
    this.poemId = poem_id;
    this.poemIndex = index;
    console.log('om');

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'thankModal modal-dialog-centered' })
    );
  }

  openModal1(template: TemplateRef<any>, poem_id, index) {
    console.log(poem_id, index);
    this.poemId = poem_id;
    this.poemIndex = index;
    console.log('om1');
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'thankModal modal-dialog-centered' })
    );
  }

  getProfileDetail() {
    const frmData = new FormData();
    frmData.append('userid', this.user_id);
    this.apiService.profileData(frmData).subscribe((res: any) => {
      if (res.status == true) {
        this.userdataa = res.data;
        console.log('profile data->', this.userdataa.recommend_poem);
      } else {
        this.userdataa = [];
        // this.notifyService.showError(res?.message);
      }
    });
  }

  confirmedDelete() {
    this.apiService
      .post('deletePoem/' + this.poemId, '', '')
      .subscribe((result1: any) => {
        var res1;
        res1 = result1;
        this.poemData.splice(this.poemIndex, 1);
        this.modalRef?.hide();
        this.notifyService.showSuccess(res1.message);
        this.router.navigateByUrl('/mycollection');
      });
  }

  removePoem() {
    this.apiService
      .post('removePoem/' + this.poemId, '', '')
      .subscribe((result1: any) => {
        var res1;
        res1 = result1;
        console.log(res1);
        console.log(this.poemIndex);
        this.modalRef?.hide();

        // this.router.navigateByUrl('/mycollection');
        // this.router.navigateByUrl('/home');

        console.log(this.poemIndex);

        this.poemData.splice(this.poemIndex,1)
        // console.log(this.poemIndex);
        // this.notifyService.showSuccess(res1.message);
      });
  }

  ClickedOut(event) {
    console.log(event.target);
    console.log('hererererer', event.target.className);
    this.modalRef?.hide();
    // console.log('Hi');
    // console.log(event);
    console.log(event.target);

    // if (event.target.className == 'hidecollection') {
    //   // this.modalRef = false;
    //   console.log('Hey');
    //   // this.modalRef?.hide();
    //   // console.log('Hi');
    // }
  }

  closeModal(modalId?: number) {
    console.log('Hi');
    this.modalService.hide(modalId);
    console.log('Hi');
  }

  ngOnInit(): void {}

  searchPoem() {
    if (this.searchedValue.length > 2) {
      setTimeout(() => {
        console.log(this.searchedValue);
        const frmData = new FormData();
        frmData.append('searchedValue', this.searchedValue);
        frmData.append('user_id', this.user_id);
        console.log('in');
        this.apiService.post('get-poem-list', frmData, '').subscribe(
          (result1: any) => {
            console.log('out');
            var res1;
            res1 = result1;
            this.isLoaded = true;
            this.poemData = res1.data.result;
            console.log('searched result =>>>', this.poemData);
          },
          (err) => {}
        );
      }, 1000);
    } else {
    }
  }

  poemList() {
    this.spinner.show();
    const frmData = new FormData();
    frmData.append('user_id', this.user_id);
    frmData.append('next', this.next);
    frmData.append('offset', this.offset);

    this.apiService.post('get-poem-list', frmData, '').subscribe(
      (result: any) => {
        var res;
        res = result;
        this.spinner.hide();
        if (res.status == true) {
          this.next = res.data.next;
          this.offset = res.data.offset;
          this.poemData = res.data.result;
          console.log('=>', res.data.result);
          this.isLoaded = true;
        } else {
          this.poemData = [];
        }
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }

  getInnerText(el) {
    return el.innerText;
  }

  loadMore() {
    console.log('Done offset', this.offset);
    if (this.next > 0) {
      setTimeout(() => {
        $('.loadMoreButton').show();
        const frmData = new FormData();
        frmData.append('id', this.user_id);
        frmData.append('offset', this.offset);
        frmData.append('user_id', this.user_id);
        this.apiService
          .post('load-more-poem', frmData, '')
          .subscribe((result: any) => {
            var res;
            res = result;
            console.log('load more result status', res.status);
            if (res.status == true) {
              console.log('in', res.data.result.length);
              if (res.data.result.length > 0) {
                this.poemData = this.poemData.concat(res.data.result);
                this.next = res.data.next;
                this.offset = res.data.offset;
                if (res.data.next == 0) {
                  $('.loadMoreButton').hide();
                }
              }
            } else {
            }
          });
      }, 500);
    } else {
      $('.loadMoreButton').hide();
    }
  }

  recommendPoem() {
    this.spinner.show();
    const frmData = new FormData();
    frmData.append('flag', this.flag);
    if (this.flag == 1) {
      this.poemType = 'any';
    } else if (this.flag == 2) {
      frmData.append('poemType', this.theme);
    } else {
      frmData.append('poemType', this.mood);
    }
    frmData.append('userid', this.user_id);
    this.apiService.post('recommend-poem', frmData, '').subscribe(
      (result: any) => {
        var res;
        res = result;
        this.spinner.hide();
        console.log('get', res.status);
        if (res.status == true) {
          this.poemData = res.data;
          this.router.navigateByUrl('/poem/' + this.poemData.itemid);
        } else {
          this.notifyService.showError('No record found');
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
}
