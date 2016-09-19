import { Filters } from '../reducers/filters';
import { AppState } from '../reducers/state';
import { Resto } from '../reducers/resto';

export function filter_restos(state: AppState): Resto[] {
    let filterFn = stateToFilter(state.filters);
    return state.restos.filter(filterFn);
}

function stateToFilter(state: Filters): ((Resto) => boolean) {
    let filters = [].concat(
        price(state),
        location(state.location),
        cuisine(state.cuisine)
    );

    if (filters.length == 0) {
        return (r => true);
    } else {
        return (resto => filters.every(fn => fn(resto)))
    }
}

// Cuisine filter
function cuisine(tgt: string): ((Resto) => boolean)[] {
    if (tgt == "all cuisines") {
        return [];
    } else {
        return [resto => resto.cuisine == tgt]
    }
}
// Location filter
function location(loc: string): ((Resto) => boolean)[] {
    if (loc == "Amsterdam") {
        return [];
    } else {
        return [resto => resto.area == loc]
    }
}
// Price filters
function price(state: Filters): ((Resto) => boolean)[] {
    let filters = [].concat(
        price_filter(state, 'budget'),
        price_filter(state, 'midrange'),
        price_filter(state, 'finedining')
    );

    if (filters.length == 0) {
        return [];
    } else {
        // return [];
        return [ resto => filters.some(fn => fn(resto)) ];
    }
}

function price_filter(state: Filters, key: string): ((Resto) => boolean)[] {
    let ii;
    switch(key) {
        case 'budget': ii = 1; break;
        case 'midrange': ii = 2; break;
        case 'finedining': ii = 3; break;
        default: ii = 0;
    }
    if (state[key]) {
        return [(r => r.price === ii)]
    } else {
        return [];
    }
}
