import { Component, OnInit, NgZone, Input, Output, EventEmitter, HostListener, TemplateRef } from '@angular/core';
import { trigger,transition,style,animate,state } from '@angular/animations';
import { GlobalFooService } from '../../app/services/globalFooService.service'  
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ApiService } from '../../app/services/api.service'; 
import { config } from '../../app/services/config'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../app/services/notification.service' 
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
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
          width: '100%',
          left: 0,
        })
      ),
      transition('* => *', animate(400)),
    ]),
  ],
})

export class SidebarComponent implements OnInit {
  @Output() changeStatus = new EventEmitter();
  @Input() state = 'false';
  disabled = false;
  user_id:any;
  responseData:any;
  subscription:Subscription;
  modalRef?: BsModalRef;
errors:any=['',null,undefined,false,'null','undefined'];
  // changeState(): void {
  //   this.state == 'closed' ? (this.state = 'open') : (this.state = 'closed');
  // }

  changeState1(): void {
    this.state == 'true' ? (this.state = 'false') : (this.state = 'true');
    this.changeStatus.emit({state:this.state});
  }

  constructor(public zone: NgZone,private modalService: BsModalService,private notifyService : NotificationService,private SharedService: GlobalFooService,private apiService:ApiService,private formBuilder: FormBuilder,private router:Router,private toastr: ToastrService) {
    

     this.subscription = this.SharedService.getObservable().subscribe((res:any)=>{
      if(localStorage.getItem('is_logged_in')=='true'){
        this.user_id    = this.apiService.decryptData(localStorage.getItem('user_token'),config.ENC_SALT);
      this.getProfileDetail();
      }else{
        this.user_id ='';
      }
    });
    
    if(localStorage.getItem('is_logged_in')=='true'){
        this.user_id    = this.apiService.decryptData(localStorage.getItem('user_token'),config.ENC_SALT);
       this.getProfileDetail();
      }else{
        this.user_id ='';
      }
  }

  getProfileDetail(){
    const frmData = new FormData();
    frmData.append("userid", this.user_id);
    this.apiService.profileData(frmData).subscribe((res: any) => {
      if (res.status==true) {
        this.responseData = res.data;
        console.log('userprofiledata',this.responseData);
        
      } else {
        this.responseData=[];
      }
    });
  }

  toggleMenu() {
    this.zone.run(() => {
      // this.state = this.state === 'out' ? 'in' : 'out';
      console.log(this.state);
    });
  }
  onredrctpoem(){
    this.modalRef.hide();
    this.router.navigateByUrl('/recommendedpoems');
  }

  onsendmeclick(template: TemplateRef<any>){
      this.zone.run(() => {
      // this.state = this.state === 'out' ? 'in' : 'out';
      console.log(this.state);
    });
      if(localStorage.getItem('is_logged_in')=='true'){
         if(this.errors.indexOf(this.responseData.recommend_poem) == -1){
            console.log('show popup');
              this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'thankModal modal-dialog-centered' })
    );
          }
          else{
            this.router.navigateByUrl('/recommendedpoems');
          }
      }else{
        this.router.navigateByUrl('/recommendedpoems');
      }
      
  }

  // ngOnInit(): void {
  //   // this.subscription = this.SharedService.getObservable().subscribe((res:any)=>{
  //   //   if(localStorage.getItem('is_logged_in')=='true'){
  //   //     this.user_id    = this.apiService.decryptData(localStorage.getItem('user_token'),config.ENC_SALT);
  //   //   }else{
  //   //     this.user_id ='';
  //   //   }
  //   // });
  // }

  logout(){
    localStorage.clear();
    this.SharedService.publishSomeData(''); 
    this.notifyService.showWarning('Logged out successfully')
    let currentUrl = this.router.navigateByUrl('/login');
  }

  deferredPrompt: any;
    showButton = true;
  
    @HostListener('window:beforeinstallprompt', ['$event'])
    onbeforeinstallprompt(e) {
      console.log('sidebar before',e);
  // localStorage.setItem('green_appinstalled','false');
      e.preventDefault();
  
      this.deferredPrompt = e;
  
      this.showButton = true;
      
    }
  
    addToHomeScreen() {
   
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
    ngOnInit(): void {}
    }

// openModal() {
//   alert("hi");
//   var values = JSON.parse(localStorage.getItem('event'));

//   console.log("values: ",values);

// console.log('retrievedObject: ', JSON.parse(retrievedObject));
// const obj = JSON.stringify(values);
// console.log(obj);
// obj.prompt();

// }

// closeModal(modalId?: number) {

//   this.modalService.hide(modalId);
// }

//   ngOnInit(): void {}
// }



