// filters.ts
import { ActionReducer, Action } from '@ngrx/store';
import { Filters } from './filters';

// var deepFreeze = require('deep-freeze');

export const SWITCH = 'SWITCH';
export const NEW_FILTERS = 'NEW_FILTERS';
export const GET_CLOSE = 'GET_CLOSE';

export const initFilters: Filters = {
    search: '',
    location: 'amsterdam',
    cuisine: 'all cuisines',
    budget: false,
    midrange: false,
    finedining: false,
    close: false
};

// deepFreeze(initFilters);

export const filtersReducer: ActionReducer<Filters> = (state: Filters = Object.assign({}, initFilters), action: Action) => {
    // console.log('Reducer:', action);
    switch (action.type) {
        case NEW_FILTERS:
            // remove close filter when new ones set
            return Object.assign({}, action.payload, {close: false});
        case GET_CLOSE:
            return Object.assign({}, initFilters, { close: true });

        default:
            return state;
    }
}
