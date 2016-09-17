import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { AppState } from '../reducers/state';
import { Filters } from '../reducers/filters';
import { NEW_FILTERS, initFilters } from '../reducers/filters_reducer';
import { Dictionary } from './dictionary';
import { toUrl } from './encoder';
import { fromUrl } from './parser';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnChanges {
  @Input() filters: Filters;
  @Output() action = new EventEmitter();
  // search: string;
  // location: string;
  // cuisine: string;
  // price: boolean[];
  cmpFilters: Filters;

  // Maps of dictionary to create select elements
  areas: Array<{key:string, name: string}> = [];
  cuisines: Array<{key:string, name: string}> = [];
  prices: Array<{key:string, name: string, state: boolean}> = [];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.areas.push({key: "all areas", name: "All Areas"});
    for (let k in Dictionary.areas) {
      this.areas.push({key: k, name: Dictionary.areas[k].name})
    }

    this.cuisines.push({key: "all cuisines", name: "All Cuisines"});
    for (let k in Dictionary.cuisines) {
      this.cuisines.push({key: k, name: Dictionary.cuisines[k].name})
    }

    // for (let p in Dictionary.prices) {
    //   this.prices.push({key: p, name: Dictionary.prices[p].name, state: true})
    // }
    this.prices = Dictionary.prices.map(p => Object.assign(p, {state: false}))
  }

  // On init, send route params to store
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.action.next({
        type: NEW_FILTERS,
        payload: fromUrl(params['filter'])
      })
    });
  }

  ngOnChanges() {
    console.log("on changes", this.filters);
    this.cmpFilters = Object.assign({},this.filters);
  }

  setCriteria($event:Event) {
    $event.preventDefault();
    let link = ['/recommendations', toUrl(this.cmpFilters)];
    this.router.navigate(link);

    this.action.emit({
      type: NEW_FILTERS,
      payload: this.cmpFilters
    })
  }
}
