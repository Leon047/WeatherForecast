import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { HttpResponse } from '@angular/common/http';
import { ApiService } from './api.service';
import { ConfirmationService } from 'primeng/api'; 
import { FilterService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})

export class AppComponent {

  forecast: any;
  input_value: string = '';

  forecast_history: any[] = [];

  user_auth_status: boolean = false;

  is_superuser: boolean = false;

  history_filter_selected_date: string = '';
  history_filter_date: any[] = [];

  history_filter_selected_name: string = '';
  history_filter_name: any[] = [];

  filter_input_value: string = '';

  history_item_display: boolean = false;
  view_forecast: any;

  selected_history: any[] = [];
  selected_all_history: boolean = false;

  historylist_delete_button_isactive: boolean = true;

  constructor(
    public api: ApiService,
    private primengConfig: PrimeNGConfig,
    private confirm_service: ConfirmationService,
    public filter_service: FilterService
  ) {
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.user_status_controler();
  }

  input_field_click(): void {
    const auth_token = this.api.get_data_ls('auth_token');
    if (this.input_value != '') {
      if (auth_token) {
        this.get_forecast_user();
      } else {
        this.get_forecast_gest(); 
      }
    }
  }

  get_forecast_gest(): void {
    this.api.get_gest_forecast(this.input_value).subscribe(
      (response: any) => {
        this.input_value = '';
        this.forecast = response;
      },
      (error: any) => {
        this.api.show_error_message(error.message); 
      }
    );
  }

  get_forecast_user(): void {
    const body = {'location': this.input_value}
    this.api.request_post('user/', body).subscribe(
      (response: any) => {
        this.input_value = '';
        this.forecast = response.body.forecast;
        this.get_user_history();
      },
      (error: any) => {
        this.api.show_error_message(error); 
      }
    );
  }

  user_status_controler(): void {
    const auth_token = this.api.get_data_ls('auth_token') || false;
    if (auth_token) {
      this.get_user_history();
      this.user_auth_status = true;
      this.check_user_status();
    }
  }

  check_user_status(): void {
    this.api.request_get('check_status').subscribe(
      (response: any) => {
        this.is_superuser = response.is_superuser;
      }
    );
  }

  get_user_history(page: number = 0): void {
    this.api.request_post('history/' + '?page=' + (page + 1)).subscribe(
      (response: HttpResponse<any>) => {
        // Sort list by (new to old).
        this.forecast_history = response.body.sort(
          (a:any ,b:any) => b.id - a.id 
        );
      }
    );
  }

  history_paginator(event: any): void {
    let page = event.page;
    this.get_user_history(page);
  }

  historylist_delete_button_click(): void {
    this.confirm_service.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.delete_selected_history();
        this.api.remove_element_from_array(
          this.forecast_history, this.selected_history);
      }
    });
  }

  delete_selected_history(): void {
    let id_list: any[] = [];
    for(let i of this.selected_history) {
      id_list.push(i.id);
    }
    this.api.request_delete_obj_list('history', id_list).subscribe(
      (response: any) => {
        this.api.show_success_message('Deleted forecast.');
        this.historylist_delete_button_isactive = true;
      },
      (error: any) => {
        console.error('There was an error!', error);
      });
  }

  filter_history_by_input_data(event: any): void {
    const filtered_list: any[] = [];
    this.api.request_post('history/').subscribe(
      (response: any) => {
        for (let f of response.body) {
          // Filter data by pattern.
          const eql = this.filter_service.filters
            .equals(f.location, this.filter_input_value);
          const cnt = this.filter_service.filters
            .contains(f.location, this.filter_input_value);
          if (eql || cnt) {
            filtered_list.push(f);
            this.forecast_history = filtered_list;
          } 
        }
      }
    );
  }

  history_item_display_click(idx: number): void {
    for (let forecast of this.forecast_history) {
      if(forecast === this.forecast_history[idx]) {
        this.view_forecast = forecast;
      }
    }
    this.history_item_display = true;
  }

  historylist_checkbox_click(): void {
    if (this.selected_history.length != 0) {
      this.historylist_delete_button_isactive = false;
    } else {
      this.historylist_delete_button_isactive = true;
    }
  }

  historylist_selectall_checkbox_click(): void {
    if (this.selected_all_history === true) {
      this.selected_history = this.forecast_history;
      this.historylist_delete_button_isactive = false;
    } 
    if (this.selected_all_history === false) {
      this.selected_history = [];
      this.historylist_delete_button_isactive = true;
    }
  }
}
