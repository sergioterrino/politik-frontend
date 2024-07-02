import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Post } from 'src/app/models/Post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private baseURL: string = 'http://localhost:8080/api/posts';

  postDeleted = new Subject<void>(); // para que el home.component.ts se entere de que se ha eliminado un post y recargue

  constructor(private httpClient: HttpClient) { }

  getPosts(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.baseURL);
  }

  //recibe la respuesta ok del backend > PostController > createPost()
  createPost(postDTO: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseURL}/create`, postDTO);
  }

  getPostsByUserId(userId: number): Observable<Post[]> {
    return this.httpClient.get<Post[]>(`${this.baseURL}/user/${userId}`);
  }

  deletePost(postId: number): Observable<any> {
    console.log("Entrando en post.service - deletePost()")
    return this.httpClient.delete<any>(`${this.baseURL}/delete/${postId}`).pipe(
      //postDeleted es un Subject que emite un valor cada vez que se elimina un post
      tap(() => this.postDeleted.next())
    );
  }
}
