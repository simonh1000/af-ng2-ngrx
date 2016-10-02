// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Resto } from '../reducers/resto';
import { AppState } from '../reducers/state';
import { initFilters, NEW_FILTERS } from '../reducers/filters_reducer';
import { Filters } from '../reducers/filters';
import { DATA } from '../reducers/restos_reducer';

import { GetDataService } from '../services/get-data.service';
import { GeoService } from '../services/geo.service';
import { Location } from '../reducers/geo';
import { Point } from '../reducers/geo';

import { filter_restos } from '../filters/apply_filters';
import { toUrl } from '../filters/encoder';
import { fromUrl } from '../filters/parser';

@Component({
    selector: 'app-framework',
    templateUrl: './framework.component.html',
    styleUrls: ['./framework.component.scss'],
    providers: [GetDataService],
    encapsulation: ViewEncapsulation.None
})
export class FrameworkComponent implements OnInit {
    restos_list: Observable<Resto[]>;  // this will be the filtered list
    filters: Observable<Filters>;
    location: Observable<Location>;
    selectedResto: Observable<string>;

    // rotm: Observable<Resto>;
    // rotms: Observable<Resto[]>;
    // selectedRestoIndex: Observable<number>;
    // selectedResto: Observable<Resto>;
    // // top5: Observable<boolean>;
    // not_top5: Observable<boolean>;
    // title: Observable<string>;

    constructor(private route: ActivatedRoute, private router: Router, public store: Store<AppState>,
                private data: GetDataService, private geo: GeoService) {
        // combines restos (i.e. distances) with filters
        this.restos_list =
            this.store.select(filter_restos);

        this.filters =
            this.store.select(state => state.filters)
                // .distinctUntilChanged()
                .do( filters => {
                    let link = ['/recommendations', toUrl(filters)];
                    this.router.navigate(link);
                } );

        this.location =
            this.store.select(state => state.location);
        this.selectedResto =
            this.store.select(state => state.selectedResto);
                // .distinctUntilChanged();

        // this.rotm = this.restos_list.map(rs => rs[0]);
        // this.rotms = this.restos_list.map(rs => rs.slice(1));

        // this.top5 =
        //     this.store.select(state => state.filters)
        //         .map(v => toUrl(v) === '');
        // this.not_top5 =
        //     this.top5.map(v => !v);

        // this.title = this.filters.map(filter_to_title);

        // this.restos = this.store.select(state => state.restos);

        // this.selectedResto =
        //     this.store.select(state => {
        //         return state.restos.find(r => r.qname === state.selectedResto)
        //     });
        // this.selectedResto =
        //     this.store.select(state => state.selectedResto)
        //         .withLatestFrom(this.restos_list, (qname, restos) => {
        //             return restos.find(r => r.qname === qname)
        //         });
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

        this.route.params.forEach((params: Params) => {
            console.log('framework: ngOnInit - sending params to store', params);
            this.store.dispatch({
                type: NEW_FILTERS,
                payload: fromUrl(params['filter'])
            });
        });
    }

    goTop5() {
        this.quickLink(initFilters);
    }

    quickLink(obj) {
        let filters = Object.assign({
            search: '',
            location: 'amsterdam',
            cuisine: 'all cuisines',
            budget: false,
            midrange: false,
            finedining: false
        }, obj);

        this.store.dispatch({
            type: NEW_FILTERS,
            payload: filters
        });
    }
}
