/* tslint:disable:no-bitwise */

import { Filters } from '../reducers/filters';
// import { AppState } from '../reducers/state';
import { Resto } from '../reducers/resto';
import { scorer } from './scorer';

export function filter_restos(restos: Resto[], filters: Filters): Resto[] {
    return filter_restos2(restos, filters)
        .map(addIndex);
}

function filter_restos2(restos: Resto[], filters: Filters): Resto[] {
    // console.log('filters', filters);
    if (filters.close) {
        return restos
            .sort((r1, r2) => r1.distance - r2.distance)
            .slice(0, 10);
    } if (filters.favourites) {
        return restos
            .filter(r => filters.favouritesList.indexOf(r.qname) !== -1)
            .sort((r1, r2) => r1.distance - r2.distance);
    } else {
        let filterFns = stateToFilters(filters);
        let scoreFn = scorer(filters);

        if (filterFns.length === 0) {         // ROTM
            return restos
                .filter(rotmFilter)
                .map( r => {
                    return Object.assign(r, {score: scoreFn(r)});
                })
                .sort((r1, r2) => r2.score - r1.score);
        } else {                            // other filters
            return restos
                .filter(resto => filterFns.every(fn => fn(resto)))
                .map( r => {
                    return Object.assign(r, {score: scoreFn(r)});
                })
                .sort( (r1, r2) => r2.score - r1.score )
                .slice(0, 20);
        }
    }
}

function addIndex(r: Resto, i: number): Resto {
    r['idx'] = i;
    return r;
}
// setScore score: scorer(distance, r.rating)

function stateToFilters(state: Filters): Array<((Resto) => boolean)> {
    return [].concat(
            price(state),
            location(state.location),
            cuisine(state.cuisine),
            search(state.search)
        );
}

function rotmFilter(r: Resto): boolean {
    return r.recommendation >= 8;
}

// function favourites()
// Cuisine filter
function cuisine(tgt: string): ((Resto) => boolean)[] {
    if (tgt === 'all cuisines') {
        return [];
    } else {
        return [ resto => resto.cuisine === tgt ];
        // return [ resto => (resto.cuisine === tgt && (resto.recommendation & 2) === 2) ];
        // return [ resto => resto.cuisine === tgt && resto.recommendation > 0 ];
    }
}
// Location filter
function location(loc: string): ((Resto) => boolean)[] {
    if (loc === 'amsterdam') {
        return [];
    } else {
        return [ resto => resto.area === loc ];
        // return [ resto => resto.area === loc && (resto.recommendation & 1) === 1 ];
        // return [ resto => resto.area === loc && resto.recommendation > 0 ];
    }
}
// Price filters
function price(state: Filters): ((Resto) => boolean)[] {
    let filters = [].concat(
        price_filter(state, 'budget'),
        price_filter(state, 'midrange'),
        price_filter(state, 'finedining')
    );

    if (filters.length === 0) {
        return [];
    } else {
        // return [];
        return [ resto => filters.some(fn => fn(resto)) ];
    }
}

function price_filter(state: Filters, key: string): ((Resto) => boolean)[] {
    let ii;
    switch (key) {
        case 'budget': ii = 1; break;
        case 'midrange': ii = 2; break;
        case 'finedining': ii = 3; break;
        default: ii = 0;
    }
    if (state[key]) {
        return [ resto => resto.price === ii ];
    } else {
        return [];
    }
}

function search(search: String): ((Resto) => boolean)[] {
    return (search === null || search === '') ? [] : [ r => r.rname.toLowerCase().indexOf(search.toLowerCase()) !== -1 ];
}

// export function filter_restos(state: AppState): Resto[] {
//     // console.log('filter_restos', state);
//     if (state.filters.close) {
//         return state.restos
//             .sort((r1, r2) => r1.distance - r2.distance)
//             .slice(0, 10);
//     } else {
//         let filters = stateToFilters(state.filters);
//         let scoreFn = scorer(state.filters);

//         if (filters.length === 0) {         // ROTM
//             return state.restos
//                 .filter(rotmFilter)
//                 .map( r => {
//                     return Object.assign(r, {score: scoreFn(r)});
//                 })
//                 .sort((r1, r2) => r2.score - r1.score);
//         } else {                            // other filters
//             return state.restos
//                 .filter(resto => filters.every(fn => fn(resto)))
//                 .map( r => {
//                     return Object.assign(r, {score: scoreFn(r)});
//                 })
//                 .sort( (r1, r2) => r2.score - r1.score )
//                 .slice(0, 20);
//         }
//     }
// }

