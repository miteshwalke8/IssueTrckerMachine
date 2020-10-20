import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { SocketService } from 'src/app/socket.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  
  public onlineNotificationModalRef: BsModalRef;
  public onlineNotificationData;
  public data = {
    activeUserId: 'activeUserId',
    authToken: 'authToken'

  }
  @ViewChild('onlineNotificationTemplate') onlineNotificationTemplate: TemplateRef<any>;

  constructor(private socketService: SocketService,
    private modalService: BsModalService,
    private router: Router) {
      this.socketService.componentMethodCalled$.subscribe(
        (onlineNotificationData) => {
          if (this.onlineNotificationModalRef === undefined &&
            onlineNotificationData.updatedBy !== Cookie.get(this.data.activeUserId)) {
            this.onlineNotificationData = onlineNotificationData;
            this.onlineNotificationModalRef = this.modalService.show(this.onlineNotificationTemplate);
          }
        }
      );
     }

  ngOnInit(): void {
  }
 
  // on click any notification, navigate to issue view of that issue
  public openIssueDescription(): void {
    if (this.onlineNotificationModalRef !== undefined) {
      this.onlineNotificationModalRef.hide();
      this.onlineNotificationModalRef = undefined;
    }
    location.reload();
    this.router.navigate(['description/'+ this.onlineNotificationData.issueNumber]);
  }

  // close the notification modal
  public closeModal(): void {
    if (this.onlineNotificationModalRef !== undefined) {
      this.onlineNotificationModalRef.hide();
      this.onlineNotificationModalRef = undefined;
    }
  }
}


