import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { map, catchError, tap } from 'rxjs/operators';


// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { PassDataService } from './pass-data.service';



@Injectable()
export class AppService {
  getnotify : any;
  private url = 'http://localhost:3000';

  constructor(
    public http: HttpClient,
    public passDataService:PassDataService
  ) {



  } // end constructor  

public EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

public EXCEL_EXTENSION = '.xlsx';

  

 



  public getUserInfoFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  } // end getUserInfoFromLocalstorage


  public setUserInfoInLocalStorage = (data) => {

    localStorage.setItem('userInfo', JSON.stringify(data))


  }

  public getToken = () => {
    return localStorage.getItem('authToken')
  }

  /* signup function api call */
  public signupFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('email', data.email)
      .set('password', data.password)
    return this.http.post(`${this.url}/api/v1/users/signup`, params);

  } // end of signupFunction function.

  /* login function api call */
  public loginFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post(`${this.url}/api/v1/users/login`, params);
  } // end of signinFunction function.

  /* forget password function api call */
  public forgotPassword(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email);
    return this.http.post(`${this.url}/api/v1/users/forgotPassword`, params);
  }

  /* reset password function api call */
  public resetPassword(data): Observable<any> {
    const params = new HttpParams()
      .set('userId', data.userId)
      .set('email', data.email)
      .set('password', data.password);
    return this.http.post(`${this.url}/api/v1/users/resetPassword`, params);
  }

  /* logout function api call */
  public logout(): Observable<any> {

    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))

    return this.http.post(`${this.url}/api/v1/users/logout`, params);

  } // end logout function

  /* get all users function api call */
  public getUsers(): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users`)
      .pipe(map((res: any[]) => res));
  }

  // Issue
  /* Get issues*/
  public getIssues(): Observable<any> {
    return this.http.get(`${this.url}/api/v1/issue/read`)
  }

  /* Create Issue api call*/
  public createIssue(data): Observable<any> {
    return this.http.post(`${this.url}/api/v1/issue/create`, data);
  }

  /*update issue api call*/
  public updateIssue(data, issueId): Observable<any> {
    return this.http.put(`${this.url}/api/v1/issue/update/${issueId}`, data);
  }

  /*delete issues api call*/
  public deleteIssue(id): Observable<any> {
    return this.http.post(this.url + '/api/v1/issue/delete', { issueId: id });
  }

  // get issue by number api call
  public FetchIssueByNumber(issueNumber): Observable<any> {
    return this.http.get(`${this.url + '/api/v1/issue/read'}/${issueNumber}`);
  }

  // file upload - issue attachements api call
  public fileUpload(formData): Observable<any> {
    return this.http.post(this.url + '/api/v1/file/upload', formData, { reportProgress: true, observe: 'events' });
  }

  // file delete - issue attachements api call
  public fileDelete(fileName): Observable<any> {
    return this.http.delete(`${this.url + '/api/v1/file/delete/'}${fileName}`);
  }

  // get notifications api call
  public getNotifications(): Observable<any> {
    
    return this.http.get(`${this.url + '/api/v1/notifications/read'}/${Cookie.get('activeUserId')} ${Cookie.get('authToken')}`);
  }

  //End Issue API
  

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + this.EXCEL_EXTENSION);
  }

  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError

}
