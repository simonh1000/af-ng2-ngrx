// filters.ts
import { ActionReducer, Action } from '@ngrx/store';
import { Filters } from './filters';

// var deepFreeze = require('deep-freeze');

export const SWITCH = 'SWITCH';
export const NEW_FILTERS = 'NEW_FILTERS';
export const GET_CLOSE = 'GET_CLOSE';
export const GET_FAVOURITES = 'GET_FAVOURITES';
export const CACHED_FAVOURITES = 'CACHED_FAVOURITES';
export const ADD_FAVOURITE = 'ADD_FAVOURITE';
export const REMOVE_FAVOURITE = 'REMOVE_FAVOURITE';

export const initFilters: Filters = {
    search: '',
    location: 'amsterdam',
    cuisine: 'all cuisines',
    budget: false,
    midrange: false,
    finedining: false,
    close: false,
    favourites: false,
    favouritesList: []
};

// deepFreeze(initFilters);

// export const filtersReducer: ActionReducer<Filters> = (state: Filters = Object.assign({}, initFilters), action: Action) => {
export function filtersReducer(state: Filters = Object.assign({}, initFilters), action: Action) {
    // console.log('Reducer:', action);
    switch (action.type) {
        case NEW_FILTERS:
            // remove close filter when new ones set
            return Object.assign({}, action.payload, {close: false});
        case GET_CLOSE:
            return Object.assign({}, initFilters, { close: true });
        case GET_FAVOURITES:
            return Object.assign({}, initFilters, { favourites: true });

        case CACHED_FAVOURITES:
            return Object.assign({}, initFilters, { favouritesList: action.payload });

        case ADD_FAVOURITE:
            let fs = [action.payload, ...state.favouritesList];
            return Object.assign(state, { favouritesList: fs });

        case REMOVE_FAVOURITE:
            let fs_ = state.favouritesList.filter(f => f !== action.payload)
            return Object.assign(state, { favouritesList: fs_ });

        default:
            return state;
    }
}
