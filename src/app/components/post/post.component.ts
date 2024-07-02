import { Component, Input } from '@angular/core';
import { Post } from 'src/app/models/Post';
import { User } from 'src/app/models/User';
import { PostService } from 'src/app/services/post/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {

  @Input() post!: Post;

  constructor( private postService: PostService) { }

  getTimeSincePosted(postCreatedAt: string): string {
    const postDate = new Date(postCreatedAt);
    const currentDate = new Date();
    const differenceInSeconds = Math.floor((currentDate.getTime() - postDate.getTime()) / 1000);

    if (differenceInSeconds < 60) {
      return `${differenceInSeconds}s`;
    } else if (differenceInSeconds < 3600) {
      return `${Math.floor(differenceInSeconds / 60)}m`;
    } else if (differenceInSeconds < 86400) {
      return `${Math.floor(differenceInSeconds / 3600)}h`;
    } else if (differenceInSeconds < 518400) { // 6 days in seconds
      return `${Math.floor(differenceInSeconds / 86400)}d`;
    } else {
      // Format the date as 'dd/mm/yy'
      const day = postDate.getDate().toString().padStart(2, '0');
      const month = (postDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based in JavaScript
      const year = postDate.getFullYear().toString().substr(-2); // Get last two digits of year
      return `${day}/${month}/${year}`;
    }
  }

  editPost(postId: number) {
    console.log("post.component.ts - editPost() - ", postId);
  }

  deletePost(postId: number) {
    console.log("post.component.ts - deletePost() - ", postId);
    this.postService.deletePost(postId).subscribe({
      next: response => {
        console.log("Post eliminado con éxito");
      },
      error: error => {
        console.log("Error al eliminar el post", error);
      }
    });
  }

}
