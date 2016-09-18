import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Resto } from '../reducers/resto';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers/state';

@Component({
  selector: 'resto-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  @Input() restos: Resto[];
  @Output() action = new EventEmitter();

  constructor() { }

  ngOnInit() { }

}
