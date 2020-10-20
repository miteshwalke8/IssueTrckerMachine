import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';



@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  public email: any;

  constructor(
    public router: Router,
    public tostr: ToastrService,
    public appServiece: AppService

  ) { }

  ngOnInit(): void {
  }

  public forgotPassword(): void {
    if (!this.email) {
      this.tostr.warning('please enter the email')
    } else {
      let data = {
        email: this.email
      };
      this.appServiece.forgotPassword(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            setTimeout(() => {
              this.tostr.success('The link has been sent your registered email id to reset password')
              this.router.navigate(['login']);

            }, 1000);
          } else {
            this.tostr.error(apiResponse.message);
          }
        })
    }
  }

}
