import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
// import { Observable } from 'rxjs';
import { Resto } from '../reducers/resto';
// import { AppState } from '../reducers/state';

@Component({
  selector: 'app-resto-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  @Input() restos: Resto[];
  @Input() title: string;
  @Output() action = new EventEmitter();

  constructor() { }

  ngOnInit() { }

}
