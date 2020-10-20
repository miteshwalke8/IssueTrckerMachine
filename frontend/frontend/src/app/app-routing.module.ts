import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  // { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule'},
  // { path: 'issue-view/:issueNumber', loadChildren: './dashboard/issue-view/issue-view.component' },
  // { path: 'resetPassword/:userId', loadChildren: './user/reset-password/reset-password.component' },
  // { path: '**', loadChildren: './user/user.module' }
  {
    path: 'notifications',
    loadChildren: () => import('src/app/shared/notifications/notifications.component')
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
