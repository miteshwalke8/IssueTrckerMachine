import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: any;
  public password: any;

  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrService) {}
   


  ngOnInit() {
  }

  public goToSignUp: any = () => {

    this.router.navigate(['/sign-up']);

  } // end goToSignUp

  public loginFunction: any = () => {

    if (!this.email) {
      this.toastr.warning('enter email')


    } else if (!this.password) {

      this.toastr.warning('enter password')


    } else {

      let data = {
        email: this.email,
        password: this.password
      }

      this.appService.loginFunction(data)
        .subscribe((apiResponse) => {

          if (apiResponse.status === 200) {
            // console.log(apiResponse.data.authToken);
           // Cookie.deleteAll();
            this.toastr.success("login Successfull")
             Cookie.set('authToken', apiResponse.data.authToken);
            let authToken= Cookie.get('authToken');
            //  console.log(authToken);
            
             Cookie.set('activeUserId', apiResponse.data.userDetails.userId);
             Cookie.set('activeUserEmail', apiResponse.data.userDetails.email);

            
             Cookie.set('activeUserName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
           
             this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
            
             this.router.navigate(['dashboard-view']);

          } else {

            this.toastr.error(apiResponse.message)
          

          }

        }, (err) => {
          this.toastr.error('some error occured, please try again ')

        });

    } // end condition

  } // end signinFunction

  

  

}