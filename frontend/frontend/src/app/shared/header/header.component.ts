import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public authToken: string = Cookie.get('authToken');
  public activeUser: string = Cookie.get('activeUser');


  constructor(
    private router: Router,
    private toastr: ToastrService,
    private appService: AppService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

  
  }

  //log out
  public logout(): void {
    this.appService.logout()
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          Cookie.delete('authToken');
          Cookie.delete('activeUser');
          this.router.navigate(['']);
          this.toastr.info("You have been logged out");
        } else {
          Cookie.deleteAll();
          this.toastr.error(apiResponse.message);
        }
      }, (err) => {
        Cookie.deleteAll();
        this.toastr.error('some error occured');
      });
  }
}
