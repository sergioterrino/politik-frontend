import { UserService } from 'src/app/services/user/user.service';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalCreatePostComponent } from '../modal-create-post/modal-create-post.component';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {

  public username: string = '';
  public name: string = '';
  public lastname: string = '';

  constructor(private userService: UserService, private dialog: MatDialog) { }

  ngOnInit() {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.username = user.username;
      this.name = user.name;
      this.lastname = user.lastname;
    }
  }

  logout() {
    this.userService.logout();
  }

  openDialogCreatePost() {
    this.dialog.open(ModalCreatePostComponent, {
      width: '55%',
      height: '40%',
    });
  }
}
