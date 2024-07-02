import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent {

  public username: string = '';
  public name: string = '';
  public lastname: string = '';

  constructor(private userService: UserService) { }

  ngOnInit() {
    const user = this.userService.getCurrentUser();
    if (user) {
      // this.username = user.username;
      // this.name = user.name;
      // this.lastname = user.lastname;
    }
  }


}
