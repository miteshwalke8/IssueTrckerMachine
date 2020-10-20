import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/Paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router, UrlSerializer } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cookie } from 'ng2-cookies';
import { AppService } from 'src/app/app.service';
import { PassDataService } from 'src/app/pass-data.service';
// import { notifications} from 'src/app/shared/notifications'

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css']
})
export class DashboardViewComponent implements OnInit {

  public issueList = [];
  public userList = [];

  public notificationList = [];
  public isFilterMyIsuues = false;
  public isLoading = true;
  public isEditIssue = false;
  public forkJoinObservable;

  public status = 'status';
  public issueNumber = 'issueNumber';
  public title = 'title';
  public createdDate = 'createdDate';
  public reporter = 'reporter';
  public assignee = 'assignee';
  public view = 'view';
  public allIssues = 'All-issues';
  public myIssues = 'My-issues';
  public activeUserId = 'activeUserId';
  public inBacklog = 'In-backlog';
  public inProgress = 'In-progress';
  public inTest = 'In-test';
  public done = 'Done';
  //public issueTemplate = 'issueTemplate';
  //public notificationTemplate = 'notificationTemplate';
  public data:'data';
  public assigneeName = 'assigneeName';
  public IssueReport = 'IssueReport';
  public modalLg = 'modal-lg';
  public modalMd = 'modal-md';

  public displayedColumns = [
    this.status,
    this.issueNumber,
    this.title,
    this.createdDate,
    this.reporter,
    this.assignee,
    this.view
  ];

  public filterOptions = [
    this.allIssues,
    this.myIssues,
    this.inBacklog,
    this.inProgress,
    this.inTest,
    this.done
  ];

  public dataSource: MatTableDataSource<any>;
  public selectedIssue: any;
  public issueModalRef: BsModalRef;
  public notificationModalRef: BsModalRef;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('issueTemplate', { static: false }) issueTemplate: TemplateRef<any>;
  @ViewChild('notificationTemplate', { static: false }) notificationTemplate: TemplateRef<any>;
  userInfo: any;
  public notify:any = [];
  public getnotifydata:any;

  constructor(private toastr: ToastrService,
    private modalService: BsModalService,
    private router: Router,
    private appservice: AppService,
    private passDataService: PassDataService) {

  }
  ngOnInit() {
    /*api calling from the services*/
    this.oncall();
    this.notify = this.appservice.getnotify;
    console.log(this.notify);
    this.getnotifydata = this.notify.message;
    console.log(this.getnotifydata);
  }
  oncall() {
    // this.userInfo = this.appservice.getUserInfoFromLocalstorage();
    //let data = Cookie.get('authToken');

    console.log(this.data);
    const getUsers = this.appservice.getUsers();
    const getIssues = this.appservice.getIssues();
    const getNotifications = this.appservice.getNotifications();
    /*ForkJoin method is being used to merge observables in one */
    this.forkJoinObservable = 
    forkJoin(getUsers, getIssues, getNotifications).pipe(map((responseArray: any) => {
     this.userList = responseArray[0].data.map(user => ({ id: user.userId, name: user.firstName +' '+ user.lastName }));//
      // this.userList = responseArray[0][this.datas];
      this.issueList = responseArray[1].data;
      this.notificationList = responseArray[2].data;
      console.log(this.notificationList);
      // let data = this.passDataService.addresses;
      return responseArray;
      // this.userList.subscribe(x => console.log(x));
      console.log(responseArray);
    }));
    console.log("User list")
    console.log(this.userList);
    console.log(this.issueList);

    console.log(this.notificationList);

    /*calling a merged api*/
    this.forkJoinObservable.subscribe(() => {
      this.setDataTable();
    }, err => {
      this.isLoading = false;
      this.toastr.error('Some error occurred.');
      this.router.navigate(['dashboard-view']);
      console.log('error')
    });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource = new MatTableDataSource(this.issueList);
      this.setPaginator();
    }, 0);
  }


  private setDataTable() {
    this.issueList.forEach(issue => {
      const matchedUser = this.userList.find(user => user.id === issue.assigneeUserId);
      issue[this.assigneeName] = matchedUser ? matchedUser.name : '';
    });
    this.dataSource = new MatTableDataSource(this.issueList);
    this.setPaginator();
  }

  /*setting pagination for issue table */
  private setPaginator(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    this.isLoading = false;
  }

  // on click create issue button, open issue-form in modal
  public openIssueModal(issue): void {
    this.isEditIssue = issue ? true : false;
    console.log(issue);
    this.selectedIssue = issue;
    console.log(this.selectedIssue);
    this.issueModalRef = this.modalService.show(this.issueTemplate, { class: this.modalLg });
  }
  // openIssueModals(){
  //   console.log('Hello')
  // }
  // cloase the issue-form modal
  public closeIsuueModal(): void {
    if (this.issueModalRef !== undefined) {
      this.issueModalRef.hide();
    }
  }

  // on click notification button, open list of notifications in modal
  public openNotificationModal(): void {
    this.notificationModalRef = this.modalService.show(this.notificationTemplate, { class: this.modalMd });
    //this.router.navigate(['notifications']);//
  }

  // on issue-form submit, save the issue
  public saveIssue(data): void {
    this.isLoading = true;
    this.appservice.createIssue(data.formData).subscribe(apiResponse => {
      this.isLoading = false;
      if (apiResponse.status === 200) {
        if (data.isFormSubmitted) {
          this.toastr.success('New issue has been created');
          this.ngOnInit();
          if (this.issueModalRef !== undefined) {
            this.issueModalRef.hide();
          }
        }
      } else {
        this.toastr.error('Issue created failed');
      }
    });
  }

  // on click Export button, export the filtered issue list in excel file
  public exportAsExcelFile(): void {
    this.appservice.exportAsExcelFile(this.dataSource.filteredData, this.IssueReport);
  }

  // on search any issue from search bar, apply filter with serached value
  public applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  // on select any filter option, apply filter accordingly
  public onSelecteFilter(selectedFilterOption): void {
    let filteredList;
    switch (selectedFilterOption) {
      case this.allIssues:
        this.dataSource = new MatTableDataSource(this.issueList);
        this.setPaginator();
        break;
      case this.myIssues:
        filteredList = this.issueList.filter(issue => issue.assigneeUserId === Cookie.get(this.activeUserId));
        this.dataSource = new MatTableDataSource(filteredList);
        break;
      case this.inBacklog:
      case this.inProgress:
      case this.inTest:
      case this.done:
        filteredList = this.issueList.filter(issue => issue.status === selectedFilterOption);
        this.dataSource = new MatTableDataSource(filteredList);
        break;
      default:
        this.dataSource = new MatTableDataSource(this.issueList);
        break;
    }
    this.setPaginator();
  }

  // on click of any issue navigate to that issue's description page
  public openIssueDescription(issueNumber): void {
    this.router.navigate(['description/' + issueNumber]);
  }
}
