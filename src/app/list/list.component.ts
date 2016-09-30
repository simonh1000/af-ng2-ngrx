import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, ViewEncapsulation } from '@angular/core';

import { Resto } from '../reducers/resto';

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
