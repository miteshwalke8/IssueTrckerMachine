import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Cookie } from 'ng2-cookies';
import { SocketService } from 'src/app/socket.service';
import { AppService } from 'src/app/app.service';


@Component({
  selector: 'app-description-view',
  templateUrl: './description-view.component.html',
  styleUrls: ['./description-view.component.css']
})
export class DescriptionViewComponent implements OnInit {

  public issue;
  public isLoading = true;
  public userList = [];
  public watchersNameList = [];
  public newComment;
  public issueModalRef: BsModalRef;
  public activeUserId = 'activeUserId';
  public activeUserEmail = 'activeUserEmail';
  public activeUserName = 'activeUserName'
  
 
  @ViewChild('issueTemplate', {static: false}) issueTemplate: TemplateRef<any>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appservice: AppService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    if (this.activatedRoute.snapshot.params && this.activatedRoute.snapshot.params.issueNumber) {
      this.getIssueByNumber(this.activatedRoute.snapshot.params.issueNumber);
    } else {
      this.router.navigate(['dashboard-view']);
    }
  }

  // call get issue by number to display the selected issue's details
  public getIssueByNumber(issueNumber): void {
    this.appservice.FetchIssueByNumber(issueNumber).subscribe(response => {
      if (response.status === 200) {
        this.issue = response.data[0];
        this.getUsers();
      } else {
        this.router.navigate(['dashboard-view']);
      }
    });
  }

  // get list of users
  public getUsers(): void {
    this.appservice.getUsers().subscribe(response => {
      if (response.status === 200) {
        this.userList = response.data.map(user => ({ id: user.userId, name: user.userName }));
        this.watchersNameList = this.userList.filter(user => this.issue.watchers.includes(user.id));
        this.isLoading = false;
      } else {
        this.router.navigate(['dashboard-view']);
      }
    });
  }

  // on click update button, open edit issue-form in modal
  public openIssueModal(): void {
    this.issueModalRef = this.modalService.show(this.issueTemplate, { class: 'modal-lg' });
  }

  // on click dashboard button, navigate to dashboard
  public BackToDashboard(): void {
    this.router.navigate(['dashboard-view']);
  }

  // on comment added, call saveIssue with comment data
  public addComment(): void {
    this.issue.comments.push({
      message: this.newComment,
      author: Cookie.get(this.activeUserName),
      dateTime: new Date()
    });
    this.saveIssue({
      formData: {
        comments: this.issue.comments,
        lastUpdatedDate: new Date(),
        lastUpdatedBy: Cookie.get(this.activeUserName)
      }
    });
  }

  // on comment removed, call saveIssue with comment data
  public removeComment(selectedComment): void {
    this.issue.comments = this.issue.comments.filter(comment => comment !== selectedComment);
    this.saveIssue({
      formData: {
        comments: this.issue.comments,
        lastUpdatedDate: new Date(),
        lastUpdatedBy: Cookie.get(this.activeUserName)
      }
    });
  }

  // check wheter the active user is watching this issue or not
  public isWatching(): boolean {
    return this.issue.watchers.includes(Cookie.get(this.activeUserId));
  }

  // on click watch button, add the active user in watchers list and call saveIssue with watchers data
  public onClickWatch(): void {
    if (this.isWatching()) {
      this.issue.watchers = this.issue.watchers.filter(id => id !== Cookie.get(this.activeUserId));
    } else {
      this.issue.watchers.push(Cookie.get(this.activeUserId));
    }
    
    this.saveIssue({
      formData: {
        watchers: this.issue.watchers,
        lastUpdatedDate: new Date(),
        lastUpdatedBy: Cookie.get(this.activeUserName)
      }
    });
    this.watchersNameList = this.userList.filter(user => this.issue.watchers.includes(user.id));
    this.generateNotification();
  }

  // on submit of cancle issue-form, cloase the issue-form modal
  public closeIsuueModal(): void {
    if (this.issueModalRef !== undefined) {
      this.issueModalRef.hide();
    }
  }
 
  
  // on update of issue, generate notification for that issue.
  private generateNotification(): any {
    const notificationReceivers = this.issue.watchers;
    console.log(notificationReceivers);
    notificationReceivers.push(this.issue.assigneeUserId);
    notificationReceivers.push(this.issue.reporterUserId);
    const data = {
      notificationReceivers: [...new Set(notificationReceivers)],
      issueNumber: this.issue.issueNumber,
      updatedBy: Cookie.get(this.activeUserId),
      message: `Issue ID-${this.issue.issueNumber} updated by ${Cookie.get(this.activeUserName)}`,
      link: window.location.href
    };
    console.log(data)
    this.appservice.getnotify = data;
    console.log
    (this.appservice.getnotify);
    return data;
   
  }

  // on click submit or added comment or change watch status, update the issue.
  public saveIssue(data): void {
    if (this.issueModalRef !== undefined && data.isFormSubmitted) {
      this.issueModalRef.hide();
    }
    this.isLoading = true;
    this.appservice.updateIssue(data.formData, this.issue.issueId).subscribe(response => {
      this.isLoading = false;
      if (response.status === 200) {
        this.toastr.success('Issue updated');
        if (data.isFormSubmitted) {
          this.socketService.notifyUpdates(this.generateNotification());
          this.ngOnInit();
        }
      } else {
        this.toastr.error('Issue update failed');
      }
    });
  }

  // called on click delete button, to delete the issue
  public deleteIssue(): void {
    this.appservice.deleteIssue(this.issue.issueId).subscribe(response => {
      this.isLoading = false;
      if (response.status === 200) {
        this.toastr.success('Issue deleted');
        this.router.navigate(['dashboard-view']);
      } else {
        this.toastr.error('Isuue delete failed');
      }
    });
  }


}
