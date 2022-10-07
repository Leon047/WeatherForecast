import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ConfirmationService } from 'primeng/api';  

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass']
})
export class AuthComponent implements OnInit {

  login_display: boolean = false;
  registration_display: boolean = false;

  user_display: boolean = false;
  user_profile_edit: boolean = true;
  user_profile_save_button: boolean = true;

  user_profile: any = {
    'id': '',
    'username': '',
    'email': '',
    'first_name': '',
    'last_name': '',
  };

  registration_data: any = {
    'email': '',
    'username': '',
    'password': ''
  };

  repit_password: string = '';
  invalid_form_style: string = '';
  auth_status: boolean = false;

  user_name: string = '';

  dropdown_items: any[] = [];

  credentials: any = {
    'email': '',
    'password': ''
  };

  credentials_checkbox: boolean = false;

  change_password_display: boolean = false;

  change_password_items: any = {
    'new_pswrd': '',
    'repit_pswrd': ''
  }

  password_is_visible: any = {
    'new_pswrd': 'password',
    'repit_pswrd': 'password'
  }

  password_input_error: string = '';

  constructor(
    public api: ApiService,
    private confirm_service: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.user_auth_status();
  }

  user_auth_status(): void {
    const username = this.api.get_data_ls('user_name');
    const token = this.api.get_data_ls('auth_token');
    if (token) {
      this.auth_status = true; 
      this.user_name = username; 
      this.auth_dropdown(); 
    } else {
      this.auth_status = false;
    }
  }

  auth_dropdown(): void {
    this.dropdown_items = [
      {label: 'User', icon: 'pi pi-user', command: () => {
        this.get_user_public_profile();
        this.user_display = true;
        this.user_profile_edit = true;
      }},
      {label: 'Logout', icon: 'pi pi-sign-out', command: () => {
        this.logout();
      }},
    ];
  }

  login(): void {
    const username = this.credentials.email;
    const password = this.credentials.password;
    this.api.request_auth(username, password)
      .subscribe(
        (response: any) => {
          if (response['auth_token']) {
            this.api.set_data_ls('auth_token', response['auth_token']);
            this.api.set_data_ls('user_name', username);
            this.save_user_creds();
            this.user_auth_status();
            this.login_display = false;
            window.location.reload();
          }
        },
        (error: any) => {
          this.api.show_error_message(username);
        }
      );
  }

  logout(): void {
    this.api.request_post('auth/token/logout').subscribe(
      (response: any) => {
        this.api.rm_data_ls('auth_token');
        this.api.rm_data_ls('user_name');
        this.user_auth_status();
        window.location.reload();
      },
      (error: any) => {
        console.error('There was an error!', error);
      }
    );
  }

  show_login_display(): void {
    this.credentials_checkbox = JSON.parse(
      this.api.get_data_ls('credentials_checkbox')) || false;

    if (this.credentials_checkbox) {
      this.credentials = JSON.parse(
        this.api.get_data_ls('credentials')) || this.credentials;
    }
    this.login_display = true;
  }

  credentials_checkbox_click(): void {
    if (this.credentials_checkbox) {
      this.api.set_data_ls('credentials_checkbox', true);
    } else {
      this.api.rm_data_ls('credentials_checkbox');
    }
  }

  save_user_creds(): void {
    if (this.credentials_checkbox) {
      this.api.set_data_ls('credentials', JSON.stringify(this.credentials));
    } 
  }

  get_user_public_profile(): void {
    this.api.request_get('profile').subscribe(
      (response: any) => {
        this.user_profile = response;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  personal_information_edit(): void {
    if (this.user_profile_edit === true) {
      this.user_profile_edit = false;
      this.user_profile_save_button = false;
      this.change_password_display = false;
    } else {
      this.user_profile_edit = true;
      this.user_profile_save_button = true;
    }
  }

  save_user_public_profile(): void {
    this.api.request_post('profile/', this.user_profile)
    .subscribe(
      (response: any) => {
        this.user_profile_edit = true;
        this.api.show_success_message('Save data!');
      },
      (error: any) => {
        this.api.show_error_message('Save error!');
      }
    );
  } 

  save_user_public_profile_button_click(): void {
    const new_pswrd = this.change_password_items.new_pswrd;
    const repit_pswrd = this.change_password_items.repit_pswrd;

    if (new_pswrd.length === 0 && repit_pswrd.length === 0 || new_pswrd === repit_pswrd) {
      if (this.user_profile_edit === false) {
        this.save_user_public_profile(); 
      }
      if (new_pswrd.length != 0) {
        this.change_password();
        this.password_input_error = '';
        this.change_password_items.new_pswrd = '';
        this.change_password_items.repit_pswrd = '';
        this.change_password_display = false;
        this.user_profile_save_button = true;
      }
    } else {
      if (new_pswrd != repit_pswrd) {
        this.password_input_error = 'ng-invalid ng-dirty';
        this.api.show_error_message('Passwords do not match!');
      }
    }
  }

  show_registration_display(): void {
    this.registration_display = true;
    this.login_display = false;
  }

  registration(): void {
    if (this.registration_data.password === this.repit_password) {
      this.api.registration_request_post(this.registration_data)
        .subscribe(
          (response: any) => {
            this.registration_display = false;
            this.login_display = true;
          },
          (error: any) => {
            this.api.show_error_message('Registration error!');
          }
        );
    } else {
      this.invalid_form_style = 'ng-invalid ng-dirty';
      this.api.show_error_message('Invalid password!');
    }
  }

  delete_profile(): void {
    console.log();
    this.api.request_delete('profile', this.user_profile.id)
      .subscribe(
        (response: any) => {
          localStorage.clear();
          this.user_auth_status();
          window.location.reload();
        },
        (error: any) => {
          this.api.show_error_message('Error while deleting!');
        }
    );
  }

  delete_profile_button_click(): void {
    this.confirm_service.confirm({
      message: 'Do you want to delete this profile?',
      header: 'Delete profile',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.delete_profile();
      }
    });
  }

  change_password(): void {
    let new_password = {
      'password': this.change_password_items.new_pswrd
    }
    this.api.change_password_request_post(new_password)
      .subscribe(
        (response: any) => {
          this.api.show_success_message('Save password!');
        },
        (error: any) => {
          this.api.show_error_message('Password change error!');
        }
    );
  }

  change_password_click(): void {
    if (this.change_password_display === true) {
      this.change_password_display = false;
      this.user_profile_save_button = true;
    } else {
      this.user_profile_edit = true;
      this.change_password_display = true;
      this.user_profile_save_button = false;
    }
  }

  new_password_is_visible_button_click(): void {
    if (this.password_is_visible.new_pswrd === '') {
      this.password_is_visible.new_pswrd = 'password';
    } else {
      this.password_is_visible.new_pswrd  = '';
    }
  }

  repit_password_is_visible_button_click(): void {
    if (this.password_is_visible.repit_pswrd === '') {
      this.password_is_visible.repit_pswrd = 'password';
    } else {
      this.password_is_visible.repit_pswrd  = '';
    }
  }
}
