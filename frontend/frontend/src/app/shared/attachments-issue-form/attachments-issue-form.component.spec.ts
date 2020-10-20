import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentsIssueFormComponent } from './attachments-issue-form.component';

describe('AttachmentsIssueFormComponent', () => {
  let component: AttachmentsIssueFormComponent;
  let fixture: ComponentFixture<AttachmentsIssueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachmentsIssueFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentsIssueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
