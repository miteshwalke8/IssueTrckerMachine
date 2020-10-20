import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Cookie } from 'ng2-cookies';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private userId: string;
  private componentMethodCallSource = new Subject<any>();
  public componentMethodCalled$ = this.componentMethodCallSource.asObservable();
  public socket;
  public url;
  public activeUserId = 'activeUserId';

  constructor(public http: HttpClient) {
    this.url = 'http://localhost:3000';
    this.socket = io(this.url);
    this.userId = Cookie.get(this.activeUserId);
    this.socket.on(this.userId, (data) => {
      this.callComponentMethod(data);
    });
  }
  // emit issue notifications
  public notifyUpdates(notificationReceivers) {
    this.socket.emit('issue-notifications', notificationReceivers);
  }

  // call component method to show notification modal.
  private callComponentMethod(data): void {
    this.componentMethodCallSource.next(data);
  }
}
