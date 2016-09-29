// import { Component, OnInit } from '@angular/core';
import {Component, OnInit, trigger, state, style, transition, animate, ViewEncapsulation} from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Resto } from '../reducers/resto';
import { AppState } from '../reducers/state';
import { initFilters, NEW_FILTERS } from '../reducers/filters_reducer';
import { Filters, Point } from '../reducers/filters';
import { DATA } from '../reducers/restos_reducer';

import { GetDataService } from '../services/get-data.service';
import { GeoService } from '../services/geo.service';

import { toUrl } from '../filters/encoder';
import { filter_restos } from '../filters/apply_filters';
import { filter_to_title } from '../filters/filters_to_title';

@Component({
  selector: 'app-framework',
  templateUrl: './framework.component.html',
  styleUrls: ['./framework.component.scss'],
  providers: [ GetDataService ],
   encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('selectedState', [
      state('unloading', style({
        opacity: '0'
      })),
      state('loading', style({
        opacity: '1'
      })),
      // transition('loading => unloading', animate('500ms ease-in')),
      transition('unloading => loading', animate('300ms'))
    ])
  ]
})
export class FrameworkComponent implements OnInit {

  restos_list: Observable<Resto[]>;  // this will be the filtered list
  map_restos_list: Observable<Resto[]>;  // this will be the filtered list
  filters: Observable<Filters>;
  rotm: Observable<Resto>;
  rotms: Observable<Resto[]>;
  selectedResto: Observable<Resto>;
  top5: Observable<boolean>;
  not_top5: Observable<boolean>;
  title: Observable<string>;
  currentLocation: Observable<Point>;

  animationState: string = 'loading';

  constructor(public store: Store<AppState>, private data: GetDataService, private geo: GeoService) {
    this.restos_list = this.store.select(filter_restos);
    // this.map_restos_list = this.store.select(state => (state.mapReady) ? filter_restos(state) : [] );

    this.rotm = this.restos_list.map(rs => rs[0]);
    this.rotms = this.restos_list.map(rs => rs.slice(1));

    this.top5 = this.store.select(state => state.filters).map(v => toUrl(v) === '');
    this.not_top5 = this.store.select(state => state.filters).map(v => toUrl(v) !== '');

    this.filters = this.store.select(state => state.filters);
    this.currentLocation = this.store.select(state => state.filters.geo);
    // this.title = this.store.select(state => state.filters).map(this.filtersToTitle);
    this.title = this.filters.map(filter_to_title);

    this.selectedResto = this.store.select(state => state.selectedResto[0]);
    // this.selectedResto = this.store.select(state => state.selectedResto[0] || null).do( () => {
    //   this.animationState = 'unloading';
    //   console.log('start animation OUT');
    //   setTimeout( () => {
    //     this.animationState = 'loading';
    //     console.log('start animation IN');
    //   }, 500);
    // }); //.delay(500);

    geo.getGeo();
  }

  ngOnInit(): void {
    this.data.getData()
    .subscribe( data => {
        console.log('Data returned');
        this.store.dispatch({
          type: DATA,
          payload: data
        });
      });
  }

  // goDam() {
  //   this.quickLink({location: 'Dam'});
  // }

  quickLink(obj) {
      let filters = Object.assign({}, this.filters, obj);

      this.store.dispatch({
        type: NEW_FILTERS,
        payload: filters
      });
  }

  getClass(selectedResto: Resto[]) {
    // console.log('getClass', selectedResto);
    return (typeof selectedResto === 'undefined' || selectedResto === null) ? 'sim-test-none' : 'sim-test-selected';
  }
}
