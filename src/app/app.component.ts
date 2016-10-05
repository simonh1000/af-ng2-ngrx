import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PlatformLocation } from '@angular/common';
// import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Resto } from './reducers/resto';
import { AppState } from './reducers/state';
import { initFilters, NEW_FILTERS } from './reducers/filters_reducer';
import { Filters } from './reducers/filters';
import { DATA } from './reducers/restos_reducer';

import { GetDataService } from './services/get-data.service';
import { GeoService } from './services/geo.service';
import { MaybePoint } from './reducers/geo';
// import { Point } from './reducers/geo';

import { filter_restos2 } from './filters/apply_filters';
import { toUrl } from './filters/encoder';
import { fromUrl } from './filters/parser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    restos_list: Observable<Resto[]>;  // this will be the filtered list
    filters: Observable<Filters>;
    myLocation: Observable<MaybePoint>;
    selectedResto: Observable<number>;
    mapReady: Observable<boolean>;

    constructor(public location: PlatformLocation,
                public store: Store<AppState>,
                private data: GetDataService, private geo: GeoService) {

        let filterString = this.location.pathname.split('/').slice(2)[0];
        if ('url filters', filterString) {
            console.log(filterString);
            this.store.dispatch({
                type: NEW_FILTERS,
                payload: fromUrl(filterString)
            });
        }

       // combines restos (i.e. distances) with filters
this.restos_list =
    // this.store.select(filter_restos);
    Observable.combineLatest(
            this.store.select('restos'),
            this.store.select('filters'),
            (rs, fs) => filter_restos2(rs, fs));

        this.filters =
            this.store.select(state => state.filters)
                // .distinctUntilChanged()
                .do( filters => {
                    this.location.pushState({}, '', '/recommendations/' + toUrl(filters));
                    // ) .go('/recommendations/' + toUrl(filters));
                } );

        this.myLocation =
            this.store.select(state => state.myLocation);
        this.selectedResto =
            this.store.select(state => state.selectedResto);
        this.mapReady =
            this.store.select(state => state.mapReady);

        geo.getGeo();
    }

    ngOnInit(): void {
        this.data.getData()
            .subscribe(data => {
                // console.log('Data returned');
                // this.restos = data;
                this.store.dispatch({
                    type: DATA,
                    payload: data
                });
            });


        // this.route.params.forEach((params: Params) => {
        //     console.log('framework: ngOnInit - sending params to store', params);
        //     this.store.dispatch({
        //         type: NEW_FILTERS,
        //         payload: fromUrl(params['filter'])
        //     });
        // });
    }

    // goTop5() {
    //     this.quickLink({});
    // }

    quickLink(obj) {
        let filters = Object.assign({}, initFilters, obj);

        this.store.dispatch({
            type: NEW_FILTERS,
            payload: filters
        });
    }
}
