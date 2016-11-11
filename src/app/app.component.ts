import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PlatformLocation } from '@angular/common';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { WindowRef } from './services/window.ref';
// import { GoogleAPI } from './map-loader.service';
import { GoogleMapsLoader } from './map/map-loader.service';


import { Resto } from './reducers/resto';
import { AppState } from './reducers/state';
import { initFilters, NEW_FILTERS, GET_CLOSE } from './reducers/filters_reducer';
import { Filters } from './reducers/filters';
import { DATA } from './reducers/restos_reducer';
import { MAP_READY, MAP_CODE_READY } from './reducers/map_reducer';

import { GetDataService } from './services/get-data.service';
import { GeoService } from './services/geo.service';
import { MaybePoint } from './reducers/geo';

import { filter_restos2 } from './filters/apply_filters';
import { toUrl } from './filters/encoder';
import { fromUrl } from './filters/parser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    restos_list: Observable<Resto[]>;  // the filtered list
    filters: Observable<Filters>;
    myLocation: Observable<MaybePoint>;
    selectedRestoIndex: Observable<number[]>;
    mapReady: Observable<number>;

    constructor(public location: PlatformLocation,
                public store: Store<AppState>,
                private window: WindowRef,
                private data: GetDataService, private geo: GeoService) {

        // googleApi.loadAPI.then(res => console.log('map.conponent', res));
        GoogleMapsLoader.load()
        .then(res => {
            console.log('GoogleMapsLoader.load.then', res);
            this.store.dispatch({
                type: MAP_CODE_READY
            })
        })
        .catch(err => {
            console.error(err);
        });

        // Get database
        this.data.getData()
            .subscribe(data => {
                this.store.dispatch({
                    type: DATA,
                    payload: data
                });
            });

        // Get the URL location
        let filterString = this.location.pathname.split('/').slice(2)[0];
        if (filterString) {
            let parsedFilter = fromUrl(filterString);
            if (parsedFilter['close']) {
                this.store.dispatch({
                    type: GET_CLOSE
                });
            } else {
                this.store.dispatch({
                    type: NEW_FILTERS,
                    payload: fromUrl(filterString)
                });
            }
        }

        // combines restos (i.e. distances) with filters
        this.restos_list =
            Observable.combineLatest(
                this.store.select('restos'),
                this.store.select('filters'),
                (rs : Resto[], fs) => filter_restos2(rs, fs));

        this.filters =
            this.store.select(state => state.filters)
                // This line needed as otherwise change in geolocation triggers state to be 
                // resent, overwriting any changes user has made on filters menu
                .distinctUntilChanged()
                .do( (filters: Filters) => {
                    // this.location.pushState({}, '', '/recommendations/' + toUrl(filters));
                    this.location.pushState({}, '', toUrl(filters));
                } );

        this.myLocation =
            this.store.select(state => state.myLocation);
        this.selectedRestoIndex =
            this.store.select(state => state.selectedRestoIndex);
        this.mapReady =
            this.store.select(state => state.mapReady);

        geo.getGeo();
    }

    quickLink(obj) {
        let filters = Object.assign({}, initFilters, obj);

        this.store.dispatch({
            type: NEW_FILTERS,
            payload: filters
        });
    }
}
