import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Resto } from '../reducers/resto';

@Component({
  selector: 'app-resto',
  templateUrl: './resto.component.html',
  styleUrls: ['./resto.component.css']
})
export class RestoComponent {
  @Input() resto: Resto;
  @Output() action = new EventEmitter();

  constructor() { }
}
