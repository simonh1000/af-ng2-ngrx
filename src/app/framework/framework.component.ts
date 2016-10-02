// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, trigger, state, style, transition, animate, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Resto } from '../reducers/resto';
import { AppState } from '../reducers/state';
import { initFilters, NEW_FILTERS } from '../reducers/filters_reducer';
import { Filters } from '../reducers/filters';
import { DATA } from '../reducers/restos_reducer';

import { GetDataService } from '../services/get-data.service';
import { GeoService } from '../services/geo.service';
import { Location } from '../reducers/geo';
import { Point } from '../reducers/geo';

import { toUrl } from '../filters/encoder';
import { filter_restos } from '../filters/apply_filters';
import { filter_to_title } from '../filters/filters_to_title';

@Component({
    selector: 'app-framework',
    templateUrl: './framework.component.html',
    styleUrls: ['./framework.component.scss'],
    providers: [GetDataService],
    encapsulation: ViewEncapsulation.None,
    animations: [
    trigger('selectedResto', [
      state('void', style({
        height: '0'
      })),
      state('unloading', style({
        opacity: '0'
      })),
      state('open', style({
        height: '*',
        opacity: '1'
      })),
      transition('void <=> open', animate('500ms')),
      transition('* => *', animate('300ms'))
    ])
  ]
})
export class FrameworkComponent implements OnInit {
    restos_list: Observable<Resto[]>;  // this will be the filtered list
    restos: Observable<Resto[]>;  // this will be the filtered list
    filters: Observable<Filters>;
    // location: Observable<Location>
    location: Observable<Location>

    rotm: Observable<Resto>;
    rotms: Observable<Resto[]>;
    selectedRestoIndex: Observable<number>;
    selectedResto: Observable<Resto>;
    top5: Observable<boolean>;
    not_top5: Observable<boolean>;
    title: Observable<string>;

    selectedRestoState: string = '';

    constructor(public store: Store<AppState>, private data: GetDataService, private geo: GeoService) {
        // combines restos (i.e. distances) with filters
        this.restos_list = this.store.select(filter_restos).distinct();
        this.filters = this.store.select(state => state.filters);
        this.location = this.store.select(state => state.location);

        this.rotm = this.restos_list.map(rs => rs[0]);
        this.rotms = this.restos_list.map(rs => rs.slice(1));

        this.top5 = this.store.select(state => state.filters).map(v => toUrl(v) === '');
        this.not_top5 = this.store.select(state => state.filters).map(v => toUrl(v) !== '');

        this.title = this.filters.map(filter_to_title);

        // this.restos = this.store.select(state => state.restos);

        // this.selectedResto =
        //     this.store.select(state => {
        //         return state.restos.find(r => r.qname === state.selectedResto)
        //     });
        this.selectedResto =
            this.store.select(state => state.selectedResto)
                .withLatestFrom(this.restos_list, (qname, restos) => {
                    return restos.find(r => r.qname === qname)
                });
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
                console.log('Data returned');
                // this.restos = data;
                this.store.dispatch({
                    type: DATA,
                    payload: data
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

    getClass(selectedResto: Resto[]) {
        // console.log('getClass', selectedResto);
        return (typeof selectedResto === 'undefined' || selectedResto === null) ? 'sim-test-none' : 'sim-test-selected';
    }
}

// if (!Array.prototype.find) {
//   Array.prototype.find = function(predicate) {
//     'use strict';
//     if (this == null) {
//       throw new TypeError('Array.prototype.find called on null or undefined');
//     }
//     if (typeof predicate !== 'function') {
//       throw new TypeError('predicate must be a function');
//     }
//     var list = Object(this);
//     var length = list.length >>> 0;
//     var thisArg = arguments[1];
//     var value;

//     for (var i = 0; i < length; i++) {
//       value = list[i];
//       if (predicate.call(thisArg, value, i, list)) {
//         return value;
//       }
//     }
//     return undefined;
//   };
// }