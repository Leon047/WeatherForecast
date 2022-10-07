import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ConfirmationService } from 'primeng/api';  
import { FilterService } from 'primeng/api';

@Component({
  selector: 'app-allhistory',
  templateUrl: './allhistory.component.html',
  styleUrls: ['./allhistory.component.sass']
})
export class AllhistoryComponent implements OnInit {

  history_list: any[] = [];

  history_filter_selected_date: string = '';
  history_filter_date: any = [];

  history_filter_selected_name: string = '';
  history_filter_name: any = [];

  filter_input_value: string = '';

  history_item_display: boolean = false;
  view_forecast: any;

  selected_history: any[] = [];
  selected_all_history: boolean = false;

  historylist_delete_button_isactive: boolean = true;

  constructor(
    public api: ApiService,
    private confirm_service: ConfirmationService,
    public filter_service: FilterService
  ) { }

  ngOnInit(): void {
    this.get_all_history_list();
  }

  get_all_history_list(): void {
    this.api.request_get('history').subscribe(
      (response: any) => {
        this.history_list = response;
      },
      (error: any) => {
        console.error('There was an error!', error);
      });
  }

  historylist_delete_button_click(): void {
    this.confirm_service.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.delete_selected_history();
        this.api.remove_element_from_array(
          this.history_list, this.selected_history);
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
    this.api.request_get('history/').subscribe(
      (response: any) => {
        for (let f of response) {
          // Filter data by pattern.
          const eql = this.filter_service.filters
            .equals(f.location, this.filter_input_value);
          const cnt = this.filter_service.filters
            .contains(f.location, this.filter_input_value);
          if (eql || cnt) {
            filtered_list.push(f);
            this.history_list = filtered_list;
          } 
        }
      }
    );
  }

  history_item_display_click(idx: number): void {
    for (let forecast of this.history_list) {
      if(forecast === this.history_list[idx]) {
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
      this.selected_history = this.history_list;
      this.historylist_delete_button_isactive = false;
    } 
    if (this.selected_all_history === false) {
      this.selected_history = [];
      this.historylist_delete_button_isactive = true;
    }
  }
}
