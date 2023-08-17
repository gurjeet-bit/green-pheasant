import { Component, OnInit, TemplateRef, HostListener } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-app-download',
  templateUrl: './app-download.component.html',
  styleUrls: ['./app-download.component.scss'],
})
export class AppDownloadComponent implements OnInit {
  modalRef?: BsModalRef;
  hideShowDiv: boolean;
  is_app_exist: any;
  parentUrlEnding = "app-download";
showicnArrow;
urlh: any;
  constructor(private modalService: BsModalService,private activatedRoute: ActivatedRoute) {

    if (window.matchMedia('(display-mode: standalone)').matches === true) {
                 console.log('hidden the button');
                 this.showicnArrow = false;
       }
       else{
        console.log('show the button');
        this.showicnArrow = true;
       }

    localStorage.setItem('installicn','true');
     // this.urlh = this.activatedRoute.url;
     //  this.urlh.subscribe(response => {
     //    console.log('lasturl---', response[response.length - 1]);
     //    if (response[response.length - 1] == this.parentUrlEnding) {
     //      this.showicnArrow = true;
     //    } else {
     //      this.showicnArrow = false;
     //    }
     //  })
     //  console.log('icomshw---', this.showicnArrow);
    this.hideShowDiv = true;
    console.log('eeeee',localStorage.getItem('green_appinstalled'));
    this.is_app_exist = localStorage.getItem('green_appinstalled');
     console.log('is_app_exist',this.is_app_exist);

  }
  
  deferredPrompt: any;
  showButton = true;


  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e) {
    console.log('e');
    console.log(e);

    e.preventDefault();

    this.deferredPrompt = e;

    this.showButton = true;
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
  ngOnInit(): void {

  }
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
