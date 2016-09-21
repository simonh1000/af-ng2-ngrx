// filters.ts
import { ActionReducer, Action } from '@ngrx/store';
import { Filters } from './filters';

export const SWITCH = 'SWITCH';
export const NEW_FILTERS = 'NEW_FILTERS';
export const GEO = 'GEO';

export const initFilters: Filters = {
    search: '',
    location: 'amsterdam',
    cuisine: 'all cuisines',
    budget: false,
    midrange: false,
    finedining: false,
    geo: {lat: -999, lng: -999}
};

export const filtersReducer: ActionReducer<Filters> = (state: Filters = initFilters, action: Action) => {
    switch (action.type) {
        case NEW_FILTERS:
            // console.log('NEW_FILTERS', action.payload);
            return Object.assign({}, action.payload);
        case GEO:
            return Object.assign(state, {geo: action.payload});

        default:
            return state;
    }
}
