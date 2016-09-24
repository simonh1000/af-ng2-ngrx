import { Component, OnChanges, OnInit, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Filters } from '../reducers/filters';
import { NEW_FILTERS, GET_CLOSE, initFilters } from '../reducers/filters_reducer';
import { Dictionary } from './dictionary';
import { toUrl } from './encoder';
import { fromUrl } from './parser';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnChanges {
  @Input() filters: Filters;
  @Output() action = new EventEmitter();
  cmpFilters: Filters = initFilters;
  overlay: boolean = false;

  // Maps of dictionary to create select elements
  areas: Array<{ key: string, name: string }> = [];
  cuisines: Array<{ key: string, name: string }> = [];
  prices: Array<{ key: string, name: string, state: boolean }> = [];

  constructor(private route: ActivatedRoute, private router: Router) {
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

    this.prices = Dictionary.prices.map(p => Object.assign(p, { state: false }))
  }

  // On init, send route params to store
  ngOnInit() {
    console.log('filters: ngOnInit - sending params to store');
    this.route.params.forEach((params: Params) => {
      this.action.next({
        type: NEW_FILTERS,
        payload: fromUrl(params['filter'])
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // When app loads, ngOnChanges is triggered with the default, initial value of filters
    // Without the if-statement, this will cause a navigation to '/',
    // which would overwrite whatever might be existing url
    if (typeof changes['filters'].previousValue.budget !== 'undefined') {
      this.cmpFilters = Object.assign({}, this.filters);
      // When the filters change, we need to update the url
      console.log('onChanges - triggering router');
      let link = ['/recommendations', toUrl(this.cmpFilters)];
      this.router.navigate(link);
    }
  }

  setCriteria($event: Event) {
    console.log('setCriteria')
    $event.preventDefault();
    let link = ['/recommendations', toUrl(this.cmpFilters)];
    this.router.navigate(link);

    this.action.emit({
      type: NEW_FILTERS,
      payload: this.cmpFilters
    });
  }

  getClose() {
    this.action.emit({
      type: GET_CLOSE
    });
  }

}
