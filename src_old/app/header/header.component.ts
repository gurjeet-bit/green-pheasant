import { Component, OnInit, Input, HostListener } from '@angular/core';
import {GlobalFooService } from '../../app/services/globalFooService.service'  
import { Router,ActivatedRoute,NavigationEnd,Event,NavigationStart} from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { map, filter } from 'rxjs/operators';
import { ApiService } from '../../app/services/api.service'; 
import {config} from '../../app/services/config'
import { FormGroup, Validators } from '@angular/forms';
import {NotificationService } from '../../app/services/notification.service' 
import {trigger,transition,style,animate,state,} from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('widthGrow', [
      state(
        'false',
        style({
          width: 0,
        })
      ),
      state(
        'true',
        style({
          width: 380,
          left: 0,
        })
      ),
      transition('* => *', animate(300)),
    ]),
  ],
})

export class HeaderComponent implements OnInit {

  @Input() state = 'false';
parentUrlEnding = "/app-download";
  user_id:any;
  user_name:any;
  aftername:any;
  responseData:any;
  btnshoww:any = false;
  subscription:Subscription;

  changeState(): void {
    this.state == 'false' ? (this.state = 'true') : (this.state = 'false');
  }
showicnArrow;
  deferredPrompt: any;
  urlh: any;
  is_app_exist: any;
  showButton = true;


    @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e) {
    console.log('e');
    console.log(e);

    e.preventDefault();

    this.deferredPrompt = e;

    this.showButton = false;
    // this.is_app_exist = false;
  }

  addToHomeScreen() {
      if(!this.deferredPrompt){
      console.log('alreadyyy');
       }
    this.deferredPrompt.prompt();

    this.deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      this.deferredPrompt = null;
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    let element = document.querySelector('.navbarnew') as HTMLElement;
    if (window.pageYOffset > element.clientHeight) {
      element.classList.add('sticky-top');
    } else {
      element.classList.remove('sticky-top');
    }
  }

  constructor(private notifyService : NotificationService,private SharedService: GlobalFooService,private apiService:ApiService,private router:Router,private activatedRoute: ActivatedRoute,private toastr: ToastrService) {
    // console.log('>>>>>>>>>>>> ')
this.is_app_exist = localStorage.getItem('green_appinstalled');
    console.log('routess-->>',router.url);
    this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationStart) {
            // Show progress spinner or progress bar
            console.log('Route change detected');
        }

        if (event instanceof NavigationEnd) {
            // Hide progress spinner or progress bar
            // this.currentRoute = event.url;          
            console.log('Route change detected1',event.url);
            if(event.url == this.parentUrlEnding){
               
               if (window.matchMedia('(display-mode: standalone)').matches === true) {
                    console.log('hidden the button header');
                 this.showicnArrow = false;
                }
                else{
                  console.log('show the button header');
                  this.showicnArrow = true;
                }
            }
            else {
          this.showicnArrow = false;
        }
        }
    });
    
    if(localStorage.getItem('is_logged_in')=='true'){
      this.user_id    = this.apiService.decryptData(localStorage.getItem('user_token'),config.ENC_SALT);
      this.getProfileDetail();
      this.subscription = this.SharedService.getObservable().subscribe((res:any)=>{  
        this.user_name  = res.user_name
        this.aftername = res.user_name;
      });
    }else{
      this.user_id ='';
      this.user_name  = '';
    }

    this.subscription = this.SharedService.getObservable().subscribe((res:any)=>{  
      this.user_name  = res.user_name
      this.aftername = res.user_name;
      this.user_id    = this.apiService.decryptData(localStorage.getItem('user_token'),config.ENC_SALT);
    });
    
  }

  ngOnInit(): void {
    if(localStorage.getItem('is_logged_in')=='true'){
      this.user_id = this.apiService.decryptData(localStorage.getItem('user_token'),config.ENC_SALT);
      this.getProfileDetail();
      this.subscription = this.SharedService.getObservable().subscribe((res:any)=>{  
        this.user_name = res.user_name;
        this.aftername = res.user_name;
      });
    }else{
      this.user_id    = '';
      this.user_name  = '';
    }

  }

  ngAfterViewInit(){
    // this.getProfileDetail();
  }

  getProfileDetail(){
    const frmData = new FormData();
		frmData.append("userid", this.user_id);
    this.apiService.profileData(frmData).subscribe((res: any) => {
      if (res.status==true) {
        // console.log('res.data_header=>',res?.data?.user_name)
        this.user_name = res?.data?.user_name;
        this.aftername = res?.data?.user_name;
      }
    });
  }

 logout(){
    // localStorage.clear();
    var username= localStorage.getItem('user_name');
    console.log(this.aftername);
    this.notifyService.showWarninglogout('Goodbye, '+this.aftername);
     localStorage.removeItem('sessionid');
     localStorage.removeItem('green_userid');
     localStorage.removeItem('user_token');
     localStorage.removeItem('is_logged_in');
     localStorage.removeItem('currentUser');
     localStorage.removeItem('other_amount');
     localStorage.removeItem('price');
     localStorage.removeItem('symbol');
     localStorage.removeItem('currency');
     localStorage.removeItem('payment_type');
     localStorage.removeItem('user_id');
     localStorage.removeItem('user_name');
    this.SharedService.publishSomeData(''); 
   
  //  var ab = sessionStorage.getItem('remember_me');
  //  console.log(ab);
// sessionStorage.clear()
  //  if (ab=='true') {
      // sessionStorage.clear();
  //  } else {
  //     sessionStorage.clear();
  //  }

    let currentUrl = this.router.navigateByUrl('/login');
  } 

  public getStatus = ($event:any) => {
    this.state = $event.state
  }

}

