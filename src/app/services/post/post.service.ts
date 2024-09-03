import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Post } from 'src/app/models/Post';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  // private apiUrl: string = 'http://localhost:8080/api/posts';
  // private apiUrl = 'https://politik-backend-production.up.railway.app'; //pruebo cambiarla para la de railway
  private apiUrl = environment.apiUrl;

  // Un Subject es un tipo especial de observable que permite tanto emitir eventos como suscribirse a ellos.
  // para que el home.component.ts se entere de que se ha eliminado/updated/created un post y recargue
  postsUpdated = new Subject<void>();

  constructor(private httpClient: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(`${this.apiUrl}/api/posts`);
  }

  //recibe la respuesta ok del backend > PostController > createPost()
  createPost(postDTO: any): Observable<any> {
    // return this.httpClient.post<any>(`${this.apiUrl}/api/posts/create`, postDTO);
    return this.httpClient
      .post<any>(`${this.apiUrl}/api/posts/create`, postDTO)
      .pipe(tap(() => this.postsUpdated.next())); // el tap me permite emitir un evento
    // el next notifica a los suscriptores que un evento ha ocurrido, no da más info
  }

  getPostsByUserId(userId: number): Observable<Post[]> {
    return this.httpClient.get<Post[]>(
      `${this.apiUrl}/api/posts/user/${userId}`
    );
  }

  deletePost(postId: number): Observable<any> {
    console.log('Entrando en post.service - deletePost()');
    return this.httpClient
      .delete<any>(`${this.apiUrl}/api/posts/delete/${postId}`)
      .pipe(tap(() => this.postsUpdated.next()));
  }

  updatePost(postId: number, postDTO: any): Observable<any> {
    return this.httpClient
      .put<any>(`${this.apiUrl}/api/posts/update/${postId}`, postDTO)
      .pipe(tap(() => this.postsUpdated.next()));
  }
}
