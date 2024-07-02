import { UserService } from './../../services/user/user.service';
import { Component, ElementRef } from '@angular/core';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent {

  users: User[] = [];
  filteredUsers: User[] = [];

  constructor(private userService: UserService, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.getUsers();
    this.filteredUsers = [];
  }

  ngOnAfterViewInit(): void {
  }

  observerChangeSearch(value: string) {
    value = value.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().startsWith(value) || user.name.toLowerCase().startsWith(value)
      || user.lastname.toLowerCase().startsWith(value)
    );
    if (value == "" || value == null) {
      this.filteredUsers = [];
    }
  }

  getUsers() {
    this.userService.getUsersList().subscribe(data => {
      this.users = data;
    })
  }

  //para que cuando clicke en el inputSearch se cambien los estilos.
  onFocus() {
    this.elementRef.nativeElement.querySelector('#navbar').classList.add('focused');
    this.elementRef.nativeElement.querySelector('#i').classList.remove('text-secondary');
    this.elementRef.nativeElement.querySelector('#i').classList.add('text-primary');
  }
  onBlur() {
    this.elementRef.nativeElement.querySelector('#navbar').classList.remove('focused');
    this.elementRef.nativeElement.querySelector('#i').classList.remove('text-primary');
  }

}
