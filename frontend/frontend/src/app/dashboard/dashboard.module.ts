import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { DescriptionViewComponent } from './description-view/description-view.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [DashboardViewComponent, DescriptionViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'dashboard-view', component: DashboardViewComponent },
      { path: 'description/:issueNumber', component: DescriptionViewComponent }
    ]),
    SharedModule

  ]
})
export class DashboardModule { }
