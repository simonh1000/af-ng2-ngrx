import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PlatformLocation } from '@angular/common';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { WindowRef } from './services/window.ref';
import { GoogleMapsLoader } from './map/map-loader.service';
import { StorageService } from './services/storage.service';

import { Resto } from './reducers/resto';
import { AppState } from './reducers/state';
import { defaultFilters, NEW_FILTERS, GET_CLOSE, CACHED_FAVOURITES } from './reducers/filters_reducer';
import { Filters } from './reducers/filters';
import { Notices, INITIAL_NOTICES } from './reducers/notices_reducer';
import { DATA } from './reducers/restos_reducer';
import { MAP_READY, MAP_CODE_READY } from './reducers/map_reducer';

import { GetDataService } from './services/get-data.service';
import { GeoService } from './services/geo.service';
import { MaybePoint } from './reducers/geo';

import { filter_restos } from './filters/apply_filters';
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
    selectedQName: Observable<string[]>;
    mapReady: Observable<number>;
    favouritesOverlay: Observable<boolean>;

    constructor(public location: PlatformLocation,
                public store: Store<AppState>,
                private window: WindowRef,
                private data: GetDataService, 
                private geo: GeoService,
                private storage: StorageService) {

        GoogleMapsLoader.load()
            .then(res => {
                // console.log('[GoogleMapsLoader] Sending action to create DOM container', res);
                this.store.dispatch({
                    type: MAP_CODE_READY
                })
            })
            .catch(err => {
                console.error(err);
            });

        // Get the URL location
        let filterString = this.location.pathname.split('/').slice(2)[0];
        // console.log(filterString);
        if (filterString) {
            this.store.dispatch(fromUrl(filterString));
        }

        this.store.dispatch({
            type: CACHED_FAVOURITES,
            payload: this.storage.getCache()
        })

        this.store.dispatch({
            type: INITIAL_NOTICES,
            payload: this.storage.getNotices()
        })

        // Get database
        this.data.getData()
            .subscribe(data => {
                this.store.dispatch({
                    type: DATA,
                    payload: data
                });
            });

        // combines restos (i.e. distances) with filters
        this.restos_list =
            Observable.combineLatest(
                this.store.select('restos'),
                this.store.select('filters'),
                (rs : Resto[], fs) => filter_restos(rs, fs));

        this.filters =
            this.store.select(state => state.filters)
                // This line needed as otherwise change in geolocation triggers state to be 
                // resent, overwriting any changes user has made on filters menu
                .distinctUntilChanged()
                .do( (filters: Filters) => {
                    // console.log(filters);
                    this.location.pushState({}, '', '/recommendations/' + toUrl(filters));
                    // console.log('storing favourites', filters.favouritesList)
                    this.storage.setFavourites(filters.favouritesList);
                });

        this.favouritesOverlay =
            this.store.select(state => state.notices)
                .distinct()
                .do( (notices: Notices) => {
                    console.log('persist notices', notices)
                    this.storage.persist('notices', notices);
                })
                .map(notices => !notices.favouritesOverlayDismissed);

        this.myLocation =
            this.store.select(state => state.myLocation);

        this.selectedQName =
            this.store.select(state => state.selectedQName);

        this.mapReady =
            this.store.select(state => state.mapReady);

        geo.getGeo();
    }

    quickLink(obj) {
        let filters = Object.assign({}, defaultFilters, obj);

        this.store.dispatch({
            type: NEW_FILTERS,
            payload: filters
        });
    }
}
