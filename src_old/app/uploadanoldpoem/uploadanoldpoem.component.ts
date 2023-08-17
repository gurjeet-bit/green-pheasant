import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ApiService } from '../../app/services/api.service'; 
import {config} from '../../app/services/config'
import { FormBuilder, FormGroup, Validators,FormControl, FormArray } from '@angular/forms';
import * as $ from 'jquery';
import {GlobalFooService } from '../../app/services/globalFooService.service'  
import {NotificationService } from '../../app/services/notification.service' 
import { RichTextEditorComponent, CountService} from '@syncfusion/ej2-angular-richtexteditor';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-uploadanoldpoem',
  templateUrl: './uploadanoldpoem.component.html',
  styleUrls: ['./uploadanoldpoem.component.scss'],
})

export class UploadanoldpoemComponent implements OnInit {
  @ViewChild('toolsRTE1',{static:false}) public rteObj: RichTextEditorComponent;
  public editorConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: '200',
  minHeight: '0',
  maxHeight: 'auto',
  width: 'auto',
  minWidth: '0',
  translate: 'yes',
  enableToolbar: false,
  showToolbar: false,
  placeholder: 'The full text of the poem',
  defaultParagraphSeparator: '',
  defaultFontName: '',
  defaultFontSize: '',
  fonts: [
    {class: 'arial', name: 'Arial'},
    {class: 'times-new-roman', name: 'Times New Roman'},
    {class: 'calibri', name: 'Calibri'},
    {class: 'comic-sans-ms', name: 'Comic Sans MS'}
  ],
  customClasses: [
  {
    name: 'quote',
    class: 'quote',
  },
  {
    name: 'redText',
    class: 'redText'
  },
  {
    name: 'titleText',
    class: 'titleText',
    tag: 'h1',
  },
  ],
  uploadUrl: 'v1/image',
  uploadWithCredentials: false,
  sanitize: true,
  toolbarPosition: 'top',
  toolbarHiddenButtons: [
    ['bold', 'italic'],
    ['fontSize']
  ]
};
  modalRef?: BsModalRef;
  hideShowDiv: boolean;
  hideShowDiv1: boolean = false;
  iyear:any;
  title:any;
  poet:any;
  description = new FormControl('');
  source:any;
  source_link:any;
  notify_via:any;
  poem_in_public_domain:any;
  poem_theme_selected:any;
  poem_mood_selected:any;
  responseData:any;
  moodList:any;
  themeList:any;
  submitted = false;
	errors:any=['',null,undefined,false];
	is_submit:boolean=false;
  user_id:any;
  creators:any;
  productForm: FormGroup;
  keyword = 'name';
  data:any=[];
  selectedItems:any=[];
  moodIds:any=[];
  themeIds:any=[];
  favouriteArray:any=[];
  poet1:any;
  currentYear: number=new Date().getFullYear();
  


  get f() {
    return this.productForm.controls;
  }

   public tools: object = {
         items: [
                'Bold', ' Italic', 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
                'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                'Indent', 'Outdent', '|', 'CreateLink','CreateTable',
                'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
        };

  constructor(private SharedService: GlobalFooService,private notifyService : NotificationService,private apiService:ApiService,private fb: FormBuilder,private modalService: BsModalService,private router:Router,private toastr: ToastrService) {
    if(localStorage.getItem('is_logged_in')=='true'){ 
      this.user_id = this.apiService.decryptData(localStorage.getItem('user_token'),config.ENC_SALT);
    }else{
      localStorage.clear();
      // this.SharedService.publishSomeData('');
      this.notifyService.showWarning('Please login to use this feature')
      let currentUrl = this.router.navigateByUrl('/login');
    }
    this.hideShowDiv = true;
   
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.productForm = this.fb.group({
      title: [''],
      iyear: ['', Validators.required],
      poet1:  ['', Validators.required],
      description: [''],
      source: ['', Validators.required],
      source_link: ['', Validators.required],
      notify_via: ['0'],
      poem_in_public_domain: [false, Validators.requiredTrue],
      poem_theme_selected:[''],
      poem_mood_selected:[''],
      additional_links: this.fb.array([]),
      user_id:[this.user_id]
    });
  }

  public maxLength: number = 6000;
  public textArea: HTMLElement;
  public myCodeMirror: any;
  ngAfterViewInit(): void {
  let rteObj: RichTextEditorComponent = this.rteObj;
  setTimeout(() => { this.textArea = rteObj.contentModule.getEditPanel() as HTMLElement; }, 600);
  this.creatorList();
  }

  // ngAfterViewInit(){
  //   this.creatorList();
  // }

  additional_links(): FormArray {
    return this.productForm.get("additional_links") as FormArray;
  }

  new_additional_links(): FormGroup {
    return this.fb.group({
      itext: ["",Validators.required],
      url:  ["",Validators.required],
    });
  } 

  add_additional_links() {
    if(this.productForm.controls["additional_links"].value.length<=4){
       $('.linkAdd').show();
      this.additional_links().push(this.new_additional_links());
    }else{
      $('.linkAdd').hide();
    }
  }

  remove_additional_links(i: number) {
    console.log('remove',i)
    if(i<=4){
      $('.linkAdd').show();
      this.additional_links().removeAt(i);
    }else{
      $('.linkAdd').show();
    }
  }

  selectEvent(item:any) {
    if(this.productForm.get("otherPoet").value){
      this.productForm.get("otherPoet").setValue(null);
    }
    // console.log('poet selected',this.productForm.get('poet').value);
    this.productForm.get("poet").setValue(item.name);
  }

  onChangeSearch(val: string) {
    if(this.productForm.get("poet").value){
      this.productForm.get("poet").setValue(null);
    }
    console.log('otherPoet',this.productForm.get('otherPoet').value);
    this.productForm.get("otherPoet").setValue(val);
  }

  onFocused(e){
    console.log('e =>',e);
  }

  openBox() {
    this.hideShowDiv1 = !this.hideShowDiv1;
  } 

  openModal1(template: TemplateRef<any>,template2: TemplateRef<any>) {

     this.modalService.config.animated = false;
    this.modalRef.hide();
      this.submitted = true;
    console.log(this.productForm.value.iyear);
    console.log(this.currentYear);
    console.log('in', this.productForm.value, this.productForm.invalid);
    if (this.productForm.invalid) {
      console.log(this.productForm.invalid);
      this.notifyService.showError('All Fields Are Required');
      return;
    } else if (this.productForm.value.iyear > this.currentYear) {
      console.log('futureyearerror');
      this.notifyService.showError('Please Enter Valid Year');
      return;
    }

       this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'thankModal modal-dialog-centered' })
    );
      
    this.apiService.post('add-poem',this.productForm.value,'').subscribe((result2:any) => {
      var res2;
      res2 = result2;  
      console.log(res2)
    
      
      
      if (res2.status==true) {
        // this.notifyService.showSuccess(res2?.message)
    //     this.modalService.config.animated = false;
    // this.modalRef.hide();
    //      this.modalRef = this.modalService.show(
    //   template2,
    //   Object.assign({}, { class: 'thankModal modal-dialog-centered' })
    // );
        // this.productForm.reset();
        // this.router.navigateByUrl('/home');
      } else {
        this.responseData=[];
      }
    });
  }

  openModal(template: TemplateRef<any>,template1: TemplateRef<any>,template2: TemplateRef<any>) {
    this.submitted = true;
    console.log(this.productForm.value.iyear);
    console.log(this.currentYear);
    console.log('in', this.productForm.value, this.productForm.invalid);
    if (this.productForm.invalid) {
      console.log(this.productForm.invalid);
      this.notifyService.showError('All Fields Are Required');
      return;
    } else if (this.productForm.value.iyear > this.currentYear) {
      console.log('futureyearerror');
      this.notifyService.showError('Please Enter Valid Year');
      return;
    }
    // return false;
    console.log('out');
    if(this.productForm.controls["title"].value == ''){
      this.modalRef = this.modalService.show(
      template1,
      Object.assign({}, { class: 'thankModal modal-dialog-centered' })
    );
    }
    else{
       this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'thankModal modal-dialog-centered' })
    );
      
    this.apiService.post('add-poem',this.productForm.value,'').subscribe((result2:any) => {
      var res2;
      res2 = result2;  
      console.log(res2)
    
      
      
      if (res2.status==true) {
        // this.notifyService.showSuccess(res2?.message)
    //     this.modalService.config.animated = false;
    // this.modalRef.hide();
    //      this.modalRef = this.modalService.show(
    //   template2,
    //   Object.assign({}, { class: 'thankModal modal-dialog-centered' })
    // );
        // this.productForm.reset();
        // this.router.navigateByUrl('/home');
      } else {
        this.responseData=[];
      }
    });
    }
   
  }

  closeModal(modalId?: number) {
    this.modalService.hide(modalId);
  }

  closeredirect(){
    this.modalService.config.animated = false;
    this.modalRef.hide();
    this.productForm.reset();
    this.router.navigateByUrl('/home');
  }

  dropdownList: any[] = [];
  dropdownList1: any[] = [];
  dropdownSettings: IDropdownSettings = {};

  ngOnInit() {
    this.dropdownList = [
      { item_id: 1, item_text: 'Love' },
      { item_id: 2, item_text: 'Loss' },
      { item_id: 3, item_text: 'Relationships' },
      { item_id: 4, item_text: 'Religion or Spirituality' },
      { item_id: 5, item_text: 'Society' },
    ];

    this.dropdownList1 = [
      { item_id: 2, item_text: 'Sunny' },
      { item_id: 3, item_text: 'Gloomy' },
      { item_id: 4, item_text: 'Reflective' },
    ];

    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
    };

    this.productForm.controls["additional_links"].setValue([]); 

    this.productForm.addControl('otherPoet', new FormControl(''));
    
    this.productForm.addControl('poet', new FormControl(''));

  }

   creatorList(){
    this.apiService.post('get-all-creator','','').subscribe((result:any) => {
      var res;
      res = result;  
      console.log(res)
      if (res.status==true) {
        this.data = res.data;
        console.log(this.data)
      } else {
        this.creators=[];
      }
    });  
  }

}
