import { Filters } from '../reducers/filters';
import { AppState } from '../reducers/state';
import { Resto } from '../reducers/resto';
// import { scorer, sorter } from './sorter';

export function filter_restos(state: AppState): Resto[] {
    if (state.filters.close) {
        return [state.restos[0]];
    } else {
        let filters = stateToFilters(state.filters);

        if (filters.length === 0) {
            // return state.restos;
            return state.restos
                .filter(rotmFilter)
                .sort((r1, r2) => r2.recommendation - r1.recommendation);
        } else {
            // return state.restos;
            return state.restos
                .filter(resto => filters.every(fn => fn(resto)))
                .sort((r1, r2) => r2.score - r1.score);
        }
    }
}

function stateToFilters(state: Filters): Array<((Resto) => boolean)> {
    return [].concat(
            price(state),
            location(state.location),
            cuisine(state.cuisine)
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
        return [resto => resto.cuisine === tgt];
    }
}
// Location filter
function location(loc: string): ((Resto) => boolean)[] {
    if (loc === 'amsterdam') {
        return [];
    } else {
        return [resto => resto.area === loc];
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
        return [(r => r.price === ii)];
    } else {
        return [];
    }
}
