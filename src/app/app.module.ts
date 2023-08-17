import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MycollectionComponent } from './mycollection/mycollection.component';
import { RegisterComponent } from './register/register.component';
import { PoemComponent } from './poem/poem.component';
import { UploadanoldpoemComponent } from './uploadanoldpoem/uploadanoldpoem.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FooterComponent } from './footer/footer.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactusComponent } from './contactus/contactus.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { TermsconditionsComponent } from './termsconditions/termsconditions.component';
import { SupportUsComponent } from './support-us/support-us.component';
import { AppDownloadComponent } from './app-download/app-download.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { ReceivepoememailsComponent } from './receivepoememails/receivepoememails.component';
import { ReceivepoemnotificationsComponent } from './receivepoemnotifications/receivepoemnotifications.component';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { LoginComponent } from './login/login.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FaqsComponent } from './faqs/faqs.component';
import { RecommendedpoemsComponent } from './recommendedpoems/recommendedpoems.component';
import { SearchmeapoemComponent } from './searchmeapoem/searchmeapoem.component';
import { SendmepoemthatComponent } from './sendmepoemthat/sendmepoemthat.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import {HttpClientModule,HttpClientJsonpModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import {AutoCompleteModule} from 'angular-ngx-autocomplete';
import { NgSelectModule } from '@ng-select/ng-select'; 
import { NgxSpinnerModule } from "ngx-spinner";
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SearchPoemDetailComponent } from './search-poem-detail/search-poem-detail.component';
import {FilterPipe} from './pipes/filter.pipe';
import { RecievepoembybothComponent } from './recievepoembyboth/recievepoembyboth.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxStripeModule } from 'ngx-stripe';
import { initializeApp } from "firebase/app";
import { AngularEditorModule } from '@kolkov/angular-editor';
import { UserIdleModule  } from 'angular-user-idle';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { MomentModule } from 'angular2-moment';
initializeApp(environment.firebase);


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    MycollectionComponent,
    RegisterComponent,
    PoemComponent,
    UploadanoldpoemComponent,
    FooterComponent,
    AboutusComponent,
    ContactusComponent,
    PrivacyPolicyComponent,
    CookiePolicyComponent,
    TermsconditionsComponent,
    SupportUsComponent,
    AppDownloadComponent,
    SidebarComponent,
    ReceivepoememailsComponent,
    ReceivepoemnotificationsComponent,
    MyprofileComponent,
    LoginComponent,
    FaqsComponent,
    RecommendedpoemsComponent,
    SearchmeapoemComponent,
    SendmepoemthatComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SearchPoemDetailComponent,
    FilterPipe,
    RecievepoembybothComponent,
    EmailVerificationComponent,
    PageNotFoundComponent,
    SplashScreenComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    AutoCompleteModule,
    NgxPayPalModule,
    NgSelectModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgScrollbarModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    FilterPipeModule,
     RichTextEditorAllModule,
     AngularEditorModule,
      NgIdleKeepaliveModule.forRoot(),
    MomentModule,
    // AngReadmoreModule,
    NgxStripeModule.forRoot('pk_test_51LndPHSHphW5nYkGkwkXwgQYTxAsFymYgo3UnduwcAwdu6mpr2f2zXAFOFspIrMuyQcJ5hX2kdgzu6ZctyDElAl200XwbgVqrA'),
    NgMultiSelectDropDownModule.forRoot(),
    AccordionModule.forRoot(),
    BsDropdownModule,
    NgxScrollTopModule,ReactiveFormsModule,HttpClientModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    ToastrModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
      
      
    }), UserIdleModule.forRoot({idle: 600, timeout: 300, ping: 120})
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class AppModule {}
