import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ConfirmationService } from 'primeng/api';  
import { FilterService } from 'primeng/api';

@Component({
  selector: 'app-allusers',
  templateUrl: './allusers.component.html',
  styleUrls: ['./allusers.component.sass']
})
export class AllusersComponent implements OnInit {

  users_list: any[] = [];

  user_filter_selected_name: string = '';

  filter_input_value: string = '';

  user_display: boolean = false;
  user_information_edit: boolean = true;

  view_user: any = {
    'username': '',
    'first_name': '',
    'last_name': '',

    'is_staff': false,
    'is_superuser': false,
    'is_active': false,
  };

  selected_users: any[] = [];
  selected_all_users: boolean = false;

  userslist_delete_button_isactive: boolean = true;

  constructor(
    public api: ApiService,
    private confirm_service: ConfirmationService,
    public filter_service: FilterService
  ) {}

  ngOnInit(): void {
    this.get_user_list();
  }

  get_user_list(): void {
    this.api.request_get('users_list')
      .subscribe(
        (response: any) => {
          this.users_list = response;
        }
    );
  }

  filter_users_by_input_data(event: any): void {
    const filtered_list: any[] = [];
    this.api.request_get('users_list').subscribe(
      (response: any) => {
        for (let f of response) {
          // Filter data by pattern.
          const eql = this.filter_service.filters
            .equals(f.email, this.filter_input_value);
          const cnt = this.filter_service.filters
            .contains(f.email, this.filter_input_value);

          if (eql || cnt) {
            filtered_list.push(f);
            this.users_list = filtered_list;
          } 
        }
      }
    );
  }

  userslist_checkbox_click(): void {
    if (this.selected_users.length != 0) {
      this.userslist_delete_button_isactive = false;
    } else {
      this.userslist_delete_button_isactive = true;
    }
  }

  userslist_selectall_checkbox_click(): void {
    if (this.selected_all_users === true) {
      this.selected_users = this.users_list;
      this.userslist_delete_button_isactive = false;
    } 
    if (this.selected_all_users === false) {
      this.selected_users = [];
      this.userslist_delete_button_isactive = true;
    }
  }

  delete_selected_users(): void {
    let id_list: any[] = [];
    for(let i of this.selected_users) {
      id_list.push(i.id);
    }
    this.api.request_delete_obj_list('users_list', id_list).subscribe(
      (response: any) => {
        this.api.show_success_message('Deleted user.');
        this.userslist_delete_button_isactive = true;
      },
      (error: any) => {
        console.error('There was an error!', error);
      });
  }

  userslist_delete_button_click(): void {
    this.confirm_service.confirm({
      message: 'Do you want to delete this user?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.delete_selected_users();
        this.api.remove_element_from_array(
          this.users_list, this.selected_users);
      }
    });
  }

  user_display_button_click(idx: number): void {
    for (let user of this.users_list) {
      if(user === this.users_list[idx]) {
        this.view_user = user;
      }
    }
    this.user_display = true;
  }

  personal_information_edit(): void {
    if (this.user_information_edit === true) {
      this.user_information_edit = false;
    } else {
      this.user_information_edit = true;
    }
  }

  save_user_profile(): void {
    this.api.request_post('users_list/', this.view_user)
    .subscribe(
      (response: any) => {
        this.user_information_edit = true;
        this.api.show_success_message('Save data!');
      },
      (error: any) => {
        this.api.show_error_message('Save error!');
      }
    );
  } 
}
