/* tslint:disable:no-bitwise */

import { Filters } from '../reducers/filters';
import { Resto } from '../reducers/resto';
// import { AppState } from '../reducers/state';

type ScoreFunction = (Resto) => number;


// Add scroe for being a favourite?
export function scorer(filters: Filters) {
    let scorers = stateToScorer(filters);

    if (scorers.length === 1) {    // stateToScorer always returns at least addRating
        return function rotm(r: Resto): number {
            return (r.recommendation >= 16) ? 100 : 0;
        }
    } else {
        return function(resto: Resto) {
            return scorers.reduce( (acc, curr) => acc + curr(resto), 0);
        };
    }
}

function stateToScorer(state: Filters): ScoreFunction[] {
    return [].concat(
            price(state),
            location(state.location),
            cuisine(state.cuisine),
            [addRating]
        );
}

function addRating(r: Resto): number {
    return r.rating + ((r.booking) ? 0.2 : 0);
}
// ROTM
function rotm(r: Resto): number {
    return (r.recommendation >= 16) ? 100 : 0;
}

// Cuisine
function cuisine(tgt: string): ScoreFunction[] {
    return (tgt === 'all cuisines') ? [] : [ r => (r.cuisine === tgt && r.recommendation > 0) ? 100 : 0 ];
}

// Location
function location(loc: string): ScoreFunction[] {
    return (loc === 'amsterdam') ? [] : [ resto => (resto.area === loc) ? 100 : 0 ]
}

// Price
function price(state: Filters): ScoreFunction[] {
    let prices = ['budget', 'midrange', 'finedining'];

    return prices.reduce( (acc, curr) => {
        if (state[curr]) {
            let fn = (resto: Resto) => (resto.price === price_to_number(curr)) ? 100 : 0;
            return [fn, ...acc];
        } else {
            return acc;
        }
    }, []);
}

function price_to_number(key: string): number {
    switch (key) {
        case 'budget': return 1;
        case 'midrange': return 2;
        case 'finedining': return 3;
        default: return 0;
    }
}

// function price_filter(state: Filters, key: string): ScoreFunction[] {
//     let ii;
//     switch (key) {
//         case 'budget': ii = 1; break;
//         case 'midrange': ii = 2; break;
//         case 'finedining': ii = 3; break;
//         default: ii = 0;
//     }
//     if (state[key]) {
//         return [ resto => (resto.price === ii) ? 100 : 0 ];
//     } else {
//         return [];
//     }
// }

// function search(search: String): ScoreFunction[] {
//     return []
//     // return (typeof search === 'undefined' || search === '') ? [] : [ r => r.rname.toLowerCase().indexOf(search.toLowerCase()) !== -1 ];
// }
