import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers/state';
import { Filters } from '../reducers/filters';
import { NEW_FILTERS } from '../reducers/filters_reducer';
import { Dictionary } from './dictionary';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnChanges {
  @Input() filters: Filters;
  @Output() action = new EventEmitter();
  search: string;
  location: string;
  cuisine: string;
  price: boolean[];
  cmpFilters: Filters;
  areas: Array<{key:string, name: string}> = [];
  cuisines: Array<{key:string, name: string}> = [];
  prices: Array<{key:string, name: string, state: boolean}> = [];

  constructor(public store:Store<AppState>) {
    this.areas.push({key: "all areas", name: "All Areas"});
    for (let k in Dictionary.areas) {
      this.areas.push({key: k, name: Dictionary.areas[k].name})
    }

    this.cuisines.push({key: "all cuisines", name: "All Cusiines"});
    for (let k in Dictionary.cuisines) {
      this.cuisines.push({key: k, name: Dictionary.cuisines[k].name})
    }

    for (let p in Dictionary.prices) {
      this.prices.push({key: p, name: Dictionary.prices[p].name, state: true})
    }
  }

  // ngOnInit() {
  //   this.search = this.filters.search;
  //   this.location = this.filters.location;
  // }

  ngOnChanges() {
    this.cmpFilters = this.filters;
    // this.search = this.filters.search;
    // this.location = this.filters.location;
    // this.cuisine = this.filters.cuisine
  }

  setCriteria() {
    // let ps = this.prices.reduce( (acc, p, idx) => => (p.state) ? acc.push(p) : acc, [])
    this.cmpFilters.price = this.prices.reduce( (prev, v, idx) => {
      if (v.state) prev.push(idx + 1);
      return prev;
    }, [] );

    this.action.emit({
      type: NEW_FILTERS,
      payload: this.cmpFilters
      // payload: {
      //   search: this.search,
      //   area: this.location,
      //   cuisine: "new cuisine",
      //   price: ps,
      //   count: 1
      // }
    })
  }
}
