import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public isResetPassWord = false;
  public isForgatePassword = false;
  public currentUrl: string;
  public userId: string;

  constructor() { }

  ngOnInit(): void {
  }

}
