import { Filters } from '../reducers/filters';
import { Dictionary } from './dictionary';
// import { AppState } from '../reducers/state';
// import { Resto } from '../reducers/resto';
// import { scorer, sorter } from './sorter';

export function filter_to_title(state: Filters): string {
    if (state.close) {
        return 'Closest restaurants';
    } else {
        let titles = stateToTitles(state);

        switch (titles.length) {
            case 0: return rotmFilter();
            case 1: return titles[0];
            default: return "";
        }
    }
}

function stateToTitles(state: Filters): string[] {
    return [].concat(
            price(state),
            location(state.location),
            cuisine(state.cuisine)
        );
}

function rotmFilter(): string {
    return 'current top 5 restaurants!';
}

// Cuisine filter
function cuisine(tgt: string): string[] {
    if (tgt === 'all cuisines') {
        return [];
    } else {
        let c = Dictionary.cuisines[tgt];
        return [`AF recommended ${c.name} ${c.suffix}`];
    }
}
// Location filter
function location(tgt: string): string[] {
    if (tgt === 'amsterdam') {
        return [];
    } else {
        let c = Dictionary.areas[tgt];
        return [`AF's favourite places: ${c.name}`];
    }
}
// Price filters
function price(state: Filters): string[] {
    return[].concat(
        price_filter(state, 'budget'),
        price_filter(state, 'midrange'),
        price_filter(state, 'finedining')
    );
}

function price_filter(state: Filters, key: string): string[] {
    if (state[key]) {
        switch (key) {
            case 'budget': return ['top budget'];
            case 'midrange': return ['top mid-range'];
            case 'finedining': return ['top fine dining'];
        }
    } else {
        return [];
    }
}
