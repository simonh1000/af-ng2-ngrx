import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-framework',
  templateUrl: './framework.component.html',
  styleUrls: ['./framework.component.scss'],
  providers: [ GetDataService ]
})
export class FrameworkComponent implements OnInit {

  restos_list: Observable<Resto[]>;  // this will be the filtered list
  map_restos_list: Observable<Resto[]>;  // this will be the filtered list
  filters: Observable<Filters>;
  rotm: Observable<Resto>;
  rotms: Observable<Resto[]>;
  // selectedRestos: Observable<Resto[]>;
  selectedResto: Observable<Resto>;
  top5: Observable<boolean>;
  not_top5: Observable<boolean>;
  title: Observable<string>;
  currentLocation: Observable<Point>;

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
    this.title = this.filters.map(f => this.filtersToTitle(f));

    this.selectedResto = this.store.select(state => state.selectedResto[0]);

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

  goDam() {
    this.quickLink({location: 'dam'});
  }

  quickLink(obj) {
      let filters = Object.assign({}, initFilters, obj);

      this.store.dispatch({
        type: NEW_FILTERS,
        payload: filters
      });
  }

  filtersToTitle(filters) {
    return 'another title';
  }
}
