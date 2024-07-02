import { UserService } from 'src/app/services/user/user.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { User } from 'src/app/models/User';
import { PostService } from 'src/app/services/post/post.service';
import { Post } from 'src/app/models/Post';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  users: User[] = [];
  filteredUsers: User[] = [];

  currentUser: User = new User(); //para poder obtener el user_id para el postIt()
  showCreatorPosts: boolean = true; //para mostrar o no el textarea para crear posts

  postDTO: any = {};
  text: string = ''; //a través de ngModel obtengo el texro escrito
  imagePath: string = ""; //esto lo obtendré cuando clicken en addImage, aún no sé cómo xd
  videoPath: string = ""; // = que imagePath
  @ViewChild('myTextarea') myTextarea!: ElementRef; //para obtener el elemento <textarea> y limpiar el texto después de crear el post

  //Para la parte de los posts
  posts: Post[] = []; //Estos son todos los posts existetes, que se mostrarán en el home

  constructor(private userService: UserService, private postService: PostService) { }

  ngOnInit() {
    this.getUsers();
    this.filteredUsers = [];
    this.currentUser = this.userService.getCurrentUser();
    console.log("home.ts - ngOnInit() - currentUser", this.currentUser);
    console.log("home.ts - ngOnInit() - currentUser.rol", this.currentUser.rol);
    if (this.currentUser.rol == "citizen") this.showCreatorPosts = false;
    this.getPosts();
    
    // me suscribo al Subject postDeleted para que cuando se elimine un post, se actualice la lista de posts
    this.postService.postDeleted.subscribe(() => {
      this.getPosts();
    });
  }

  observerChangeSearch(value: string) {
    value = value.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().startsWith(value) || user.name.toLowerCase().startsWith(value) ||
      user.lastname.toLowerCase().startsWith(value)
    );
    if (value == "" || value == null) {
      this.filteredUsers = [];
    }
  }

  getUsers() {
    this.userService.getUsersList().subscribe(data => {
      console.log("home.ts - getUsers() - data", data);
      this.users = data;
    })
  }

  onSubmitPost() {
    //getImg
    //getVideo

    //creo el postDTO, objeto que contiene los datos que enviaré al Backend para crear el post en la db
    this.postDTO = {
      text: this.text,
      imagePath: this.imagePath,
      videoPath: this.videoPath
    }

    // llamo al método createPost() del Service para que envíe los datos
    this.postService.createPost(this.postDTO).subscribe({
      next: (response: any) => {
        console.log('response home.ts onSubmitPost() -> ', response);
      },
      error: (err: any) => {
        console.log('Error: onSubmitPost() - error al enviar los datos del post en Frontend', err);
      },
      complete: () => {
        console.log('home.ts - createPost() - Petición completa');
        this.text = ''; //limpio el textarea (ngModel)
        this.myTextarea.nativeElement.value = ''; //limpio el textarea (sin ngModel)
        this.getPosts(); //actualizo la lista de posts
      }
    })

    console.log('texto escrito en el textarea: ', this.text);
  }

  //metodo obtener todos los posts de la db
  getPosts() {
    this.postService.getPosts().subscribe(data => {
      console.log("home.ts - getPosts() - data", data);
      this.posts = data;
      console.log("home.ts - getPosts() - data", this.posts);
    })
  }

  // setea el texto a guardar en la db con lo que haya en textarea
  onInput(event: any): void {
    this.text = event.target.value; // obtiene el texto escrito en el textarea

    //ajusta la altura del textarea cuando hay más de una línea
    let textarea: any = event.target; //obtiene el elemento <textarea>
    textarea.style.overflow = 'hidden';
    textarea.style.height = 'auto'; //el textarea cambia de tamaño para ajustarse al contenido
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
