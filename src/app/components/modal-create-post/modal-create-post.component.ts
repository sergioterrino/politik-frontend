import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Output,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Post } from 'src/app/models/Post';
import { PostService } from 'src/app/services/post/post.service';

@Component({
  selector: 'app-modal-create-post',
  templateUrl: './modal-create-post.component.html',
  styleUrls: ['./modal-create-post.component.scss'],
})
export class ModalCreatePostComponent {
  postDTO: any = {};
  text: string = '';
  imagePath: string = ''; //esto lo obtendré cuando clicken en addImage, aún no sé cómo xd
  videoPath: string = ''; // = que imagePath
  @ViewChild('myTextarea') myTextarea!: ElementRef; //para obtener el elemento <textarea> y limpiar el texto después de crear el post

  //Para la parte de los posts
  posts: Post[] = []; //Estos son todos los posts existentes, que se mostrarán en el home

  constructor(
    private postService: PostService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalCreatePostComponent>
  ) {}

  // comrpobar si se ha abierto la modal para editar el post
  ngOnInit() {
    if (this.data && this.data.isEditing) {
      console.log(
        'modal-create-post.component.ts - ngOnInit() - isEditing data: ',
        this.data.post.text
      );
      this.text = this.data.post.text;
    }
  }

  onSubmitPost() {
    //getImg
    //getVideo

    if (this.data.isEditing) {
      this.postDTO = { text: this.text };
      console.log('this.postDTO.text>>>', this.postDTO.text);
      this.postService.updatePost(this.data.postId, this.postDTO).subscribe({
        next: (response: any) => {
          console.log('response of onSubmitPost Editing -> ', response);
        },
        error: (error: any) => {
          console.log('Error onSubmitPost Editing -> ', error);
        },
        complete: () => {
          console.log('home.ts - updatePost() - Petición completa');
          this.closeDialog();
        },
      });
    } else {
      //creo el postDTO, objeto que contiene los datos que enviaré al Backend para crear el post en la db
      this.postDTO = {
        text: this.text,
        imagePath: this.imagePath,
        videoPath: this.videoPath,
      };

      // llamo al método createPost() del Service para que envíe los datos
      this.postService.createPost(this.postDTO).subscribe({
        next: (response: any) => {
          console.log('response home.ts onSubmitPost() -> ', response);
        },
        error: (err: any) => {
          console.log(
            'Error: onSubmitPost() - error al enviar los datos del post en Frontend',
            err
          );
        },
        complete: () => {
          console.log('home.ts - createPost() - Petición completa');
          this.text = ''; //limpio el textarea (ngModel)
          this.myTextarea.nativeElement.value = ''; //limpio el textarea (sin ngModel)
          this.closeDialog();
          // this.getPosts(); //actualizo la lista de posts
        },
      });
    }

    console.log('texto escrito en el textarea: ', this.text);
  }

  // //metodo obtener todos los posts de la db
  // getPosts() {
  //   this.postService.getPosts().subscribe(data => {
  //     console.log("modal-create.ts - getPosts() - data", data);
  //     this.posts = data;
  //     console.log("modal-create.ts - getPosts() - data", this.posts);
  //   })
  // }

  // setea el texto a guardar en la db con lo que haya en textarea
  onInput(event: any): void {
    this.text = event.target.value; // obtiene el texto escrito en el textarea

    //ajusta la altura del textarea cuando hay más de una línea
    let textarea: any = event.target; //obtiene el elemento <textarea>
    textarea.style.overflow = 'hidden';
    textarea.style.height = 'auto'; //el textarea cambia de tamaño para ajustarse al contenido
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  closeDialog() {
    this.dialog.closeAll();
    // this.dialogRef.close(true); // por si le quiero pasar al padre que se ha cerrado
  }
}
