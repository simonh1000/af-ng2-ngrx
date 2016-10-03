import { Component, OnInit, OnChanges, Input, Output,
  ChangeDetectionStrategy, EventEmitter, ViewEncapsulation,
  trigger, state, style, transition, animate } from '@angular/core';

import { Resto } from '../reducers/resto';
import { toUrl } from '../filters/encoder';
import { Filters } from '../reducers/filters';
import { filter_to_title } from '../filters/filters_to_title';

@Component({
  selector: 'app-resto-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
    trigger('selectedResto', [
      state('void', style({
        height: '0'
      })),
      state('unloading', style({
        opacity: '0'
      })),
      state('open', style({
        height: '*',
        opacity: '1'
      })),
      transition('void <=> open', animate('500ms')),
      transition('* => *', animate('300ms'))
    ])
  ]
})
export class ListComponent implements OnInit, OnChanges {
  @Input() restos: Resto[];
  @Input() filters: Filters;
  @Input() selectedQname: string;
  @Output() action = new EventEmitter();

  top5: boolean;
  rotm: Resto;
  selectedResto: Resto;
  rotms: Resto[];
  title: string;

  constructor() { }

  ngOnInit() { }

  ngOnChanges() {
      this.top5 = toUrl(this.filters) === '';
      if (this.top5) {
        this.rotm = this.restos[0];
        this.rotms = this.restos.slice(1);
      }
      this.title = filter_to_title(this.filters);
      this.selectedResto = this.restos.find(r => r.qname === this.selectedQname);
                      // .do( r => {
                //     if (r) {
                //         this.selectedRestoState = 'unloading';
                //         console.log('Animating OUT', r.qname);
                //         setTimeout( () => {
                //             this.selectedRestoState = 'open';
                //             console.log('start animation IN');
                //         }, 500);
                //     }
                // })
                // .delay(450);

  }
}
