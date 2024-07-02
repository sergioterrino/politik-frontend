import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListOfUsersComponent } from './list-of-users/list-of-users.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { RouterModule } from '@angular/router';
import { PollsProfileComponent } from './polls-profile/polls-profile.component';
import { RepostsProfileComponent } from './reposts-profile/reposts-profile.component';
import { PostComponent } from './post/post.component';
import { LifeBookComponent } from './life-book/life-book.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalCreatePostComponent } from './modal-create-post/modal-create-post.component';


@NgModule({
  declarations: [
    ListOfUsersComponent,
    SideBarComponent,
    SearchBarComponent,
    SuggestionsComponent,
    PollsProfileComponent,
    RepostsProfileComponent,
    PostComponent,
    LifeBookComponent,
    ModalCreatePostComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ListOfUsersComponent,
    SideBarComponent,
    SearchBarComponent,
    SuggestionsComponent,
    PollsProfileComponent,
    RepostsProfileComponent,
    PostComponent,
    LifeBookComponent,
    ModalCreatePostComponent,
  ]
})
export class ComponentsModule { }
