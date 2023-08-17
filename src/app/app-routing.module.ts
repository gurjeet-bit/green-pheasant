import { MycollectionComponent } from './mycollection/mycollection.component';
import { HomeComponent } from './home/home.component';
import { UnsubscribemailComponent } from './unsubscribemail/unsubscribemail.component';
import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { PoemComponent } from './poem/poem.component';
import { UploadanoldpoemComponent } from './uploadanoldpoem/uploadanoldpoem.component';
import { FooterComponent } from './footer/footer.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactusComponent } from './contactus/contactus.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { TermsconditionsComponent } from './termsconditions/termsconditions.component';
import { SupportUsComponent } from './support-us/support-us.component';
import { AppDownloadComponent } from './app-download/app-download.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ReceivepoememailsComponent } from './receivepoememails/receivepoememails.component';
import { ReceivepoemnotificationsComponent } from './receivepoemnotifications/receivepoemnotifications.component';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { LoginComponent } from './login/login.component';
import { FaqsComponent } from './faqs/faqs.component';
import { RecommendedpoemsComponent } from './recommendedpoems/recommendedpoems.component';
import { SearchmeapoemComponent } from './searchmeapoem/searchmeapoem.component';
import { SendmepoemthatComponent } from './sendmepoemthat/sendmepoemthat.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SearchPoemDetailComponent } from './search-poem-detail/search-poem-detail.component';
import { RecievepoembybothComponent } from './recievepoembyboth/recievepoembyboth.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'header',
    component: HeaderComponent,
  },
  {
    path: 'footer',
    component: FooterComponent,
  },
  {
    path: 'sidebar',
    component: SidebarComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'mycollection',
    component: MycollectionComponent,
  },
  {
    path: 'poem/:id',
    component: PoemComponent,
  },
  {
    path: 'uploadanoldpoem',
    component: UploadanoldpoemComponent,
  },
  {
    path: 'about',
    component: AboutusComponent,
  },
  {
    path: 'contactus',
    component: ContactusComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'cookie-policy',
    component: CookiePolicyComponent,
  },
  {
    path: 'termsconditions',
    component: TermsconditionsComponent,
  },
  {
    path: 'support-us',
    component: SupportUsComponent,
  },
  {
    path: 'app-download',
    component: AppDownloadComponent,
  },
  {
    path: 'receivepoememails',
    component: ReceivepoememailsComponent,
  },
  {
    path: 'receivepoemnotifications',
    component: ReceivepoemnotificationsComponent,
  },
  {
    path: 'myprofile',
    component: MyprofileComponent,
  },
  {
    path: 'faqs',
    component: FaqsComponent,
  },
  {
    path: 'recommendedpoems',
    component: RecommendedpoemsComponent,
  },
  {
    path: 'searchmeapoem',
    component: SearchmeapoemComponent,
  },
  {
    path: 'sendmepoemthat',
    component: SendmepoemthatComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
  },
  {
    path: 'unsubscribemail/:token/:id',
    component: UnsubscribemailComponent,
  },
  {
    path: 'search-poem-detail/:id',
    component: SearchPoemDetailComponent,
  },
  {
    path: 'receivepoembyboth',
    component: RecievepoembybothComponent,
  },
  {
    path: 'email-verification/:token/:type',
    component: EmailVerificationComponent,
  },
  { 
    path: '**', pathMatch: 'full', 
    component: PageNotFoundComponent 
  },

];




@NgModule({
  imports: [
      RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})

export class AppRoutingModule {}
