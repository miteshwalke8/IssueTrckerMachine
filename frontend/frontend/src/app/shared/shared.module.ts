import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttachmentsIssueFormComponent } from './attachments-issue-form/attachments-issue-form.component';
import { HeaderComponent } from './header/header.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { LibsModule } from '../libs/libs.module';



@NgModule({
  declarations: [AttachmentsIssueFormComponent, HeaderComponent,  NotificationsComponent],
  imports: [
    CommonModule,
    LibsModule
    
  ],

  exports: [
    AttachmentsIssueFormComponent,
    HeaderComponent,
    NotificationsComponent,
    LibsModule
  ]
})
export class SharedModule { }
