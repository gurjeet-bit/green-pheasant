import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ApiService } from '../../app/services/api.service';
import { config } from '../../app/services/config';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import * as $ from 'jquery';
import { GlobalFooService } from '../../app/services/globalFooService.service';
import { NotificationService } from '../../app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  submitted = false;
  logged_in_user_data: any;
  user_id: any;
  password;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  show = false;
  modalRef?: BsModalRef;

  constructor(
    private SharedService: GlobalFooService,
    private notifyService: NotificationService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private router: Router,
    private toastr: ToastrService
  ) {
    if (localStorage.getItem('is_logged_in') == 'true') {
      this.user_id = this.apiService.decryptData(
        localStorage.getItem('user_token'),
        config.ENC_SALT
      );
    } else {
      this.user_id = '';
      this.SharedService.publishSomeData('');
    }
  }
  // sessionStorage.getItem('uemail');
  // sessionStorage.getItem('password');
  // sessionStorage.getItem('remember_me');

  ngOnInit() {
    this.password = 'password';
    this.loginForm = this.formBuilder.group({
      // uemail: ['', Validators.required],
      // password: ['', [Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z]).{6,}$/), Validators.minLength(6)]],
      // remember_me: [false]

      uemail: [
        localStorage.getItem('remember_me')
          ? localStorage.getItem('uemail')
          : '',
        Validators.required,
      ],
      password: [
        localStorage.getItem('remember_me')
          ? localStorage.getItem('password')
          : '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*\d)(?=.*[a-z]).{6,}$/),
          Validators.minLength(6),
        ],
      ],
      remember_me: [
        localStorage.getItem('remember_me')
          ? localStorage.getItem('remember_me')
          : false,
      ],
    });
  }

  //  hideShowPassword() {
  //    console.log('eywwwwwwwwww')
  //     this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
  //     this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  // }

  onClick() {
    console.log('helloo');
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(template2: TemplateRef<any>) {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    console.log(
      this.loginForm.value.uemail,
      this.loginForm.value.password,
      this.loginForm.value.remember_me
    );
    // return false;

    this.apiService.login(this.loginForm.value).subscribe((res: any) => {
      if (res.status == true) {
        /* this.modalRef = this.modalService.show(
          template2,
          Object.assign({}, { class: 'thankModal modal-dialog-centered' })
        ); */
        this.notifyService.showSuccesslogin(res.message);
        this.user_id = this.apiService.encryptData(
          res.data.userid,
          config.ENC_SALT
        );
        localStorage.setItem('green_userid', res.data.userid);
        localStorage.setItem('user_token', this.user_id);
        localStorage.setItem('is_logged_in', 'true');

        if (this.loginForm.value.remember_me == true) {
          sessionStorage.setItem('uemail', this.loginForm.value.uemail);
          sessionStorage.setItem('password', this.loginForm.value.password);
          sessionStorage.setItem(
            'remember_me',
            this.loginForm.value.remember_me
          );
          localStorage.setItem('uemail', this.loginForm.value.uemail);
          localStorage.setItem('password', this.loginForm.value.password);
          localStorage.setItem('remember_me', this.loginForm.value.remember_me);
        } else {
          sessionStorage.clear();
          localStorage.removeItem('uemail');
          localStorage.removeItem('password');
          localStorage.removeItem('remember_me');
        }

        this.SharedService.publishSomeData({ user_name: res.data.user_name });
        this.router.navigateByUrl('/home');
      } else {
        this.notifyService.showError(res.message);
      }
    });
  }
}
