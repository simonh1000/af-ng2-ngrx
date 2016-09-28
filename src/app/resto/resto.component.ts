import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Resto } from '../reducers/resto';
import { Dictionary } from '../filters/dictionary';

@Component({
  selector: 'app-resto',
  templateUrl: './resto.component.html',
  styleUrls: ['./resto.component.scss']
})
export class RestoComponent {
  @Input() resto: Resto;
  @Input() idx: number;
  @Output() action = new EventEmitter();
  cuisines: Object = Dictionary.cuisines;
  areas: Object;

  constructor() {
    this.areas = Dictionary.areas;
  }

  toAlphaIndex(i) {
    return String.fromCharCode('A'.charCodeAt(0) + parseInt(i, 10));
  }

}
