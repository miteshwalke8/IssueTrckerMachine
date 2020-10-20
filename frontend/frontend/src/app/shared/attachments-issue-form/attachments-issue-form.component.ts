import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cookie } from 'ng2-cookies';
import { HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { groupBy } from 'rxjs/internal/operators/groupBy';
import { title } from 'process';
import { AppService } from 'src/app/app.service';


@Component({
  selector: 'app-attachments-issue-form',
  templateUrl: './attachments-issue-form.component.html',
  styleUrls: ['./attachments-issue-form.component.css']
})
export class AttachmentsIssueFormComponent implements OnInit {
  public attachedFiles = [];
  public fileUploadProgress;
  public issueFormGroup: FormGroup;

  public reporterName = 'reporterName';
  public reporterUserId = 'reporterUserId';
  public attachments = 'attachments';
  public assigneeName = 'assigneeName';
  public file = 'file';
  public filename = 'filename';
  public originalFileName = 'originalFileName';
  public bug = 'Bug';
  public newFeature = 'New Feature';
  public improvement = 'Improvement';
  public task = 'Task';
  public inBacklog = 'In-backlog';
  public inProgress = 'In-progress';
  public inReview = 'In-review';
  public inTest = 'In-test';
  public done = 'Done';
  public highest = 'Highest';
  public high = 'High';
  public medium = 'Medium';
  public low = 'Low';
  public lowest = 'Lowest';
  public title = 'title';
  public lastUpdatedDate = 'lastUpdatedDate';
  public lastUpdatedBy = 'lastUpdatedBy';

  public issueTypes = [
    this.bug,
    this.newFeature,
    this.improvement,
    this.task
  ];
  public statusList = [
    this.inBacklog,
    this.inProgress,
    this.inReview,
    this.inTest,
    this.done
  ];
  public priorityList = [
    this.highest,
    this.high,
    this.medium,
    this.low,
    this.lowest
  ];

  @Output() formCloseEvent = new EventEmitter<any>();
  @Output() formSubmitEvent = new EventEmitter<any>();
  @Input() isEditIssue: boolean;
  @Input() selectedIssue: any;
  @Input() userList: any;


  constructor(private formBuilder: FormBuilder,
    private appService: AppService,
    private toastr: ToastrService) { }

  ngOnInit() {

    if (this.isEditIssue) {
      this.issueFormGroup = this.formBuilder.group({
        issueType: [this.selectedIssue.issueType],
        title: [this.selectedIssue.title, Validators.required],
        description: [this.selectedIssue.description],
        status: [this.selectedIssue.status],
        priority: [this.selectedIssue.priority],
        assigneeUserId: [this.selectedIssue.assigneeUserId],
        estimate: [this.selectedIssue.estimate],
      });

      this.attachedFiles = this.selectedIssue.attachments ? this.selectedIssue.attachments : [];
    } else {
      this.issueFormGroup = this.formBuilder.group({
        issueType: [this.newFeature],
        title: ['', Validators.required],
        description: [''],
        status: [this.inBacklog],
        priority: [this.medium],
        assigneeUserId: [''],
        estimate: ['']
      });
    }
  }

  public data = {
    activeUserId: 'activeUserId',
    activeUserEmail: 'activeUserEmail',
    activeUserName: 'activeUserName'
  }


  // called on sumbit the issue-form to create/update the issue
  public saveIssue(isFormSubmittedFlag): void {
    if (!this.issueFormGroup.value[this.title]) {
      this.toastr.warning('Please enter the title');
      return;
    }
    if (this.isEditIssue) {
      this.issueFormGroup.value[this.lastUpdatedDate] = new Date();
      this.issueFormGroup.value[this.lastUpdatedBy] = Cookie.get(this.data.activeUserName);
    } else {
      this.issueFormGroup.value[this.reporterName] = Cookie.get(this.data.activeUserName
      );
      this.issueFormGroup.value[this.reporterUserId] = Cookie.get(this.data.activeUserId);
    }
    this.issueFormGroup.value[this.attachments] = this.attachedFiles;
    const selectedAssignee = this.userList.find(user => user.id === this.issueFormGroup.value.assigneeUserId);
    this.issueFormGroup.value[this.assigneeName] = selectedAssignee ? selectedAssignee.name : '';
    this.formSubmitEvent.emit({ formData: this.issueFormGroup.value, isEditIssue: this.isEditIssue, isFormSubmitted: isFormSubmittedFlag });
    console.log(selectedAssignee);
  }

  // called on upload attachement file.....
  public onFileChange(eventData): void {
    const uploadFile = { file: eventData.target.files.item(0), uploadProgress: '0' };
    const formData = new FormData();
    formData.append(this.file, uploadFile.file, uploadFile.file.name);
    this.appService.fileUpload(formData)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.fileUploadProgress = `${(event.loaded / event.total * 100)}%`;
        }
        if (event.type === HttpEventType.Response) {
          const url = "http://localhost:3000";
          this.attachedFiles.push({
            link: url +
              '/api/v1/issue/read' + event.body[this.filename],
            name: event.body[this.originalFileName],
            dbFileName: event.body[this.filename]
          });
          this.toastr.success('File uploaded');
        }
      }, err => {
        this.toastr.success('File upload failed, please try again.');
      });
  }

  // event on click cancle close the issue-form modal
  public onClickCancel(): void {
    this.formCloseEvent.emit();
  }

  // on click trash icon shown with attchements, remove that attched file
  public removeFile(selectedFIle): void {
    this.appService.fileDelete(selectedFIle.dbFileName).subscribe(apiesponse => {
      this.toastr.success('File removed successfully');
      this.attachedFiles = this.attachedFiles.filter(file => file !== selectedFIle);
      this.saveIssue(false);
    }, err => this.toastr.success('File remove failed'));
  }
}

