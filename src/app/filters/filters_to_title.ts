import { Filters } from '../reducers/filters';
import { Dictionary } from './dictionary';

export function filter_to_title(state: Filters): string {
    if (state.close) {
        return 'Closest restaurants';
    } else {
        let titles = stateToTitles(state);

        switch (titles.length) {
            case 0: return rotmFilter();
            case 1: return titles[0];
            default: return '';
        }
    }
}

function stateToTitles(state: Filters): string[] {
    return [].concat(
            price(state),
            location(state.location),
            cuisine(state.cuisine),
            search(state.search)
        );
}

function rotmFilter(): string {
    return 'current top 5 restaurants!';
}

function search(tgt: string): string[] {
    return (tgt !== '') ? [`Search results for: ${tgt}`] : [];
}

// Cuisine filter
function cuisine(tgt: string): string[] {
    if (tgt === 'all cuisines') {
        return [];
    } else {
        let c = Dictionary.cuisines[tgt];
        return [`${c.name} ${c.suffix} in Amsterdam`];
    }
}
// Location filter
function location(tgt: string): string[] {
    if (tgt === 'amsterdam') {
        return [];
    } else {
        let c = Dictionary.areas[tgt];
        return [` Best restaurants in ${c.name} neighbourhood`];
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
            case 'budget': return ['Top budget restaurants in Amsterdam'];
            case 'midrange': return ['Top mid-range restaurants in Amsterdam'];
            case 'finedining': return ['Top fine dining restaurants in Amsterdam'];
        }
    } else {
        return [];
    }
}
