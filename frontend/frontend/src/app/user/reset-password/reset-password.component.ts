import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public userId: any;
  public email: any;
  public confirmPassword: any;
  public password: any;

  constructor(
    public appService: AppService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public tostr: ToastrService
    
  ) { }

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.params ? this.activatedRoute.snapshot.params.userId : null;
    if (!this.userId) {
      this.router.navigate([''])
    }
  
  }
 public resetPassword(): void {
   if(this.password === this.confirmPassword) {
     let data = {
       userId:this.userId,
       password:this.password,
       email:this.email
     }
     this.appService.resetPassword(data).subscribe((apiResponse) => {
       if(apiResponse.status ==200){
         this.tostr.success('Congrats, password has been changed succesfully');
         this.router.navigate(['login']);
       }
     } , (err) =>{
       this.tostr.error(err.message)
     })
   } else {
     this.tostr.warning('password is not matched with confirmed password, please write again')
   }
 }
}
