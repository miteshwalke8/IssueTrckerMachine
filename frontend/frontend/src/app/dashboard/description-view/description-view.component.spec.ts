import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionViewComponent } from './description-view.component';

describe('DescriptionViewComponent', () => {
  let component: DescriptionViewComponent;
  let fixture: ComponentFixture<DescriptionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
