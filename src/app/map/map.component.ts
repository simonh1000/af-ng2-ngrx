import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Resto } from '../reducers/resto';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() restos: Resto[];
  @Output() action = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
