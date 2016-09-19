import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Resto } from '../reducers/resto';
import { Dictionary } from '../filters/dictionary';

@Component({
  selector: 'app-resto',
  templateUrl: './resto.component.html',
  styleUrls: ['./resto.component.css']
})
export class RestoComponent {
  @Input() resto: Resto;
  @Output() action = new EventEmitter();
  cuisines: Object;
  areas: Object;

  constructor() {
    this.cuisines = Dictionary.cuisines;
    this.areas = Dictionary.areas;
  }
}
