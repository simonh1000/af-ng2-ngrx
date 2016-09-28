// filters.ts
import { ActionReducer, Action } from '@ngrx/store';
import { Filters } from './filters';

export const SWITCH = 'SWITCH';
export const NEW_FILTERS = 'NEW_FILTERS';
export const GEO = 'GEO';
export const GET_CLOSE = 'GET_CLOSE';

export const initFilters: Filters = {
    search: '',
    location: 'amsterdam',
    cuisine: 'all cuisines',
    budget: false,
    midrange: false,
    finedining: false,
    geo: {lat: -999, lng: -999},
    close: false
};

export const filtersReducer: ActionReducer<Filters> = (state: Filters = initFilters, action: Action) => {
    switch (action.type) {
        case NEW_FILTERS:
            // remove close filter when new ones set
            return Object.assign({}, state, action.payload, {close: false});
        case GEO:
            return Object.assign({}, state, {geo: action.payload});
        case GET_CLOSE:
            return Object.assign({}, state, {
                search: '', 
                location: 'amsterdam',
                cuisine: 'all cuisines',
                budget: false,
                midrange: false,
                finedining: false,
                close: true
            });

        default:
            return state;
    }
}
