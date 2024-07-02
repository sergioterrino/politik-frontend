import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

  //el search es el evento que se va a emitir, para comunicarnos con el componente padre
  //Al usar @Output(), el componente padre puede escuchar este evento.
  @Output() search = new EventEmitter<string>();
  //el control rastrea los cambios del valor en el input del search-bar
  control = new FormControl();

  //cuando se inicializa el componente se suscribe al evento valueChanges del control
  //cada vez que haya un cambio se ejecutará la lógica de dentro del subscribe
  constructor() {
    this.control.valueChanges
      .pipe(debounceTime(700))
      .subscribe(value => {
        this.search.emit(value); // se emite ese valor a través del evento search hacia el componente padre.
      });
  }

  onFocus() {
    document.getElementById('navbar')?.classList.add('focused');
    document.getElementById('i')?.classList.remove('text-secondary');
    document.getElementById('i')?.classList.add('text-primary');
  }

  onBlur() {
    document.getElementById('navbar')?.classList.remove('focused');
    document.getElementById('i')?.classList.remove('text-primary');
  }
}
