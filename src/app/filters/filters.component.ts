import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Filters } from '../reducers/filters';
import { NEW_FILTERS, GET_CLOSE } from '../reducers/filters_reducer';
import { MaybePoint } from '../reducers/geo';
import { Dictionary } from './dictionary';
// import { toUrl } from './encoder';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  @Input() filters: Filters;
  @Input() location: MaybePoint;
  @Output() action = new EventEmitter();

  overlay: boolean = false;
  // Maps of dictionary to create select elements
  areas: Array<{ key: string, name: string }> = [];
  cuisines: Array<{ key: string, name: string }> = [];
  prices: Array<{ key: string, name: string, state: boolean }> = [];

  constructor() {
    //   Create the selects data
    for (let k in Dictionary.areas) {
      if (k) {
        this.areas.push({ key: k, name: Dictionary.areas[k].name });
      }
    }

    this.cuisines.push({ key: 'all cuisines', name: 'All Cuisines' });
    for (let k in Dictionary.cuisines) {
      if (k) {
        this.cuisines.push({ key: k, name: Dictionary.cuisines[k].name })
      }
    }

    this.prices = Dictionary.prices.map(p => Object.assign(p, { state: false }));
  }

  ngOnInit() { }
  // ngOnChanges(changes: SimpleChanges) { }

  setCriteria($event: Event) {
    // console.log('setCriteria');
    this.overlay = false;
    $event.preventDefault();
    // let link = ['/recommendations', toUrl(this.filters)];
    // this.router.navigate(link);

    this.action.emit({
      type: NEW_FILTERS,
      payload: this.filters
    });
  }

  getClose() {
    // this.router.navigate(['/recommendations', 'close']);
    this.action.emit({
      type: GET_CLOSE
    });
  }

}
