import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // main url
  URL = 'http://localhost:8000/api/v1/'

  credentials: any;

  auth_token: string = '';

  constructor(
    private http: HttpClient,
    public msg: MessageService
  ) {}

  // Remove item in localStorage 
  rm_data_ls(key: string): void {
    localStorage.removeItem(key);
  }

  // save data for localStorage
  set_data_ls(key: string, data: any): void {
    localStorage.setItem(key, data);
  }

  // get data for localStorage
  get_data_ls(key: string): any {
    return localStorage.getItem(key);
  }

  show_success_message(detail: string): void {
    this.msg.add(
      {severity:'success', summary: 'Succes', detail: detail}
    );
  }

  show_error_message(detail: string): void {
    this.msg.add(
      {severity:'error', summary: 'Error', detail: detail}
    );
  }

  remove_element_from_array(array: any, items: any): void {
    for (let i of items) {
      array.forEach((value:any, index:any) => {
        if(value == i) array.splice(index,1);
      });
    }
  }

  request_auth(username: string, password: string): any {
    return this.http.post<any>(this.URL + 'auth/token/login',
      {
        'email': username,
        'password': password
      }
    ).pipe(timeout(3000));
  }

  get_gest_forecast(location: string): any {
    const params = {'location': location}

    return this.http.get(this.URL + 'gest/', {params}).pipe(
      catchError(
        error => {
          return throwError(error.error);
        }));
  }

  request_get(path: string): any {
    const auth_token = this.get_data_ls('auth_token');
    const headers = {'Authorization': 'Token ' + auth_token}

    return this.http.get<any>(this.URL + path, {headers});
  }

  request_post(path: string, params: any = null): any {
    const auth_token = this.get_data_ls('auth_token');
    const http_options = {
        headers: new HttpHeaders({ 
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + auth_token
        }),
        observe: 'response' as 'response'
    };
    return this.http.post<any>(this.URL + path, params, http_options)
      .pipe(
        catchError(
          error => {
            return throwError(error.error);
          }));
  }

  registration_request_post(params: any): any {
    return this.http.post<any>(this.URL + 'auth/users/', params)
      .pipe(
        catchError(
          error => {
            return throwError(error.error);
          }));
  }

  change_password_request_post(body: any): any {
    const auth_token = this.get_data_ls('auth_token');
    const headers =  new HttpHeaders({ 'Authorization': 'Token ' + auth_token});
    
    return this.http.post<any>(this.URL + 'change_password/', body=body, {headers})
      .pipe(
        catchError(
          error => {
            return throwError(error.error);
          }));
  }

  request_delete(path: string, id: number): any {
    const auth_token = this.get_data_ls('auth_token');
    const headers = {'Authorization': 'Token ' + auth_token}
    const params = '/?id=' + id;

    return this.http.delete(this.URL + path + params, {headers});
  }

  request_delete_obj_list(path: string, id_list: any): any {
    const auth_token = this.get_data_ls('auth_token');
    const http_options = {
      "headers": {'Authorization': 'Token ' + auth_token},
      "body": {'id_list': id_list}
    }
    return this.http.delete(this.URL + path, http_options);
  }
}
