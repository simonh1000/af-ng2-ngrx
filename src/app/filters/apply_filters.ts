/* tslint:disable:no-bitwise */

import { Filters } from '../reducers/filters';
import { AppState } from '../reducers/state';
import { Resto } from '../reducers/resto';
import { scorer } from './scorer';

export function filter_restos(restos: Resto[], state: AppState): Resto[] {
    if (state.filters.close) {
        return restos
            .sort((r1, r2) => r1.distance - r2.distance)
            .slice(0, 10);
    } else {
        let filters = stateToFilters(state.filters);
        let scoreFn = scorer(state);

        if (filters.length === 0) {
            // return state.restos;
            return restos
                .filter(rotmFilter)
                // .sort((r1, r2) => r1.recommendation - r2.recommendation)
                .map( r => {
                    return Object.assign(r, {score: scoreFn(r)});
                })
                .sort((r1, r2) => r2.score - r1.score);
        } else {
            let res = restos
                .filter(resto => filters.every(fn => fn(resto)))
                .map( r => {
                    return Object.assign(r, {score: scoreFn(r)});
                })
                .sort((r1, r2) => r2.score - r1.score);
            // console.log(`Found ${res.length} rests, returning 20`);
            return res.slice(0, 20);
        }
    }
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
        // return [ resto => resto.price === ii && resto.recommendation > 0 ];
        // return [ resto => resto.price === ii && (resto.recommendation & 4) === 4 ];
    } else {
        return [];
    }
}

function search(search: String): ((Resto) => boolean)[] {
    return (typeof search === 'undefined' || search === '') ? [] : [ r => r.rname.toLowerCase().indexOf(search.toLowerCase()) !== -1 ];
}
