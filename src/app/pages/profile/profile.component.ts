import { UserService } from 'src/app/services/user/user.service';
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { User } from 'src/app/models/User';
import { PostService } from 'src/app/services/post/post.service';
import { Post } from 'src/app/models/Post';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  tabs: string[] = ['Posts', 'Polls', 'Reposts', 'LifeBook'];

  activatedTab: number = 0; //paso esta variable con el index para saber que tab esta activo

  user = new User();
  public username: string = '';
  public userId: number = 0;
  public name: string = '';
  public lastname: string = '';
  public birthday: string = '';
  public createdAt: string = '';

  //para la searchBar
  users: User[] = [];
  filteredUsers: User[] = [];

  //para los posts del users
  postsUser: Post[] = [];

  constructor(private userService: UserService, private datePipe: DatePipe, private postService: PostService) { }

  ngOnInit() {
    this.getUsers(); //traigo todos los users para la searchBar
    this.filteredUsers = [];
    this.user = this.userService.getCurrentUser();
    console.log('profile.ts - ngOnInit() - user.getCurrentUser() ', this.user.username);
    console.log('profile.ts - ngOnInit() - this.user.userId ', this.user.id);
    if (this.user) {
      this.username = this.user.username;
      this.userId = this.user.id;
      console.log('profile.ts - ngOnInit() - this.userId ', this.userId);
      this.name = this.user.name;
      this.lastname = this.user.lastname;
      if (this.user.birthday) {
        this.birthday = this.datePipe.transform(this.user.birthday, 'MMMM d, y') || '';
      }
      this.createdAt = this.datePipe.transform(this.user.createdAt, 'MMMM, y') || '';
      console.log('profile.ts - ngOnInit() - createdAt', this.createdAt);
    }
    this.getPostsByUserId();
  }



  observerChangeSearch(value: string) {
    value = value.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().startsWith(value) || user.name.toLowerCase().startsWith(value) ||
      user.lastname.toLowerCase().startsWith(value)
    );
    if(value == '' || value == null){
      this.filteredUsers = [];
    }
  }

  getUsers(){
    this.userService.getUsersList().subscribe(data =>
      this.users = data
    )
  }

  getPostsByUserId(){
    console.log('profile.ts - getPostsByUser() - this.userId', this.userId);
    this.postService.getPostsByUserId(this.userId).subscribe(data => {
      console.log("profile.ts - getPostsByUser() - data", data)
      this.postsUser = data
      console.log('profile.ts - getPostsByUser() - this.postsUser', this.postsUser);
    })
  }

  setTab(index: number) {
    this.activatedTab = index;
  }
}
