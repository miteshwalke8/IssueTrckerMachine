import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';

import { RouterModule, Routes } from '@angular/router';
import { UserModule } from './user/user.module';
import { LoginComponent } from './user/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SocketService } from './socket.service';
import { HeaderComponent } from './shared/header/header.component';
import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LibsModule } from './libs/libs.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppService } from './app.service';
import {TokenInterceptorService} from './token-interceptor.service'


@NgModule({
  declarations: [
    AppComponent

  ],
  imports: [
    FormsModule,
    BrowserModule,
    ModalModule.forRoot(),
    SharedModule,
    DashboardModule,
    LibsModule,
    ModalModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    UserModule,
    HttpClientModule,
    RouterModule.forRoot([
      //   { path: 'login', component: LoginComponent, pathMatch: 'full' },
      //   { path: '', redirectTo: 'login', pathMatch: 'full' },
      //   { path: '*', component: LoginComponent },
      //   { path: '**', component: LoginComponent }
      // 
    ])
  ],
  // exports: [
  //   FormsModule,
  //   BrowserModule,
  //   BrowserAnimationsModule,
  //   UserModule,
  //   HeaderComponent,
  //   HttpClientModule],
  providers: [AppService, SocketService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
