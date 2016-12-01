import { ActionReducer, Action } from '@ngrx/store';
import { FormFilters, Filters } from './filters';

// var deepFreeze = require('deep-freeze');

export const SWITCH = 'SWITCH';
export const NEW_FILTERS = 'NEW_FILTERS';
export const GET_CLOSE = 'GET_CLOSE';
export const GET_FAVOURITES = 'GET_FAVOURITES';
export const CACHED_FAVOURITES = 'CACHED_FAVOURITES';
export const ADD_FAVOURITE = 'ADD_FAVOURITE';
export const REMOVE_FAVOURITE = 'REMOVE_FAVOURITE';

export const defaultFilters: FormFilters = {
    search: '',
    location: 'amsterdam',
    cuisine: 'all cuisines',
    budget: false,
    midrange: false,
    finedining: false,
    close: false,
    favourites: false
};
export const initFilters: Filters = Object.assign({favouritesList: []}, defaultFilters);

// deepFreeze(initFilters);

export function filtersReducer(state: Filters = initFilters, action: Action) {
    // console.log('filtersReducer:', action, state);
    switch (action.type) {
        case NEW_FILTERS:
            // remove close & favourites filters when new ones set
            return Object.assign({}, state, action.payload, {close: false, favourites: false});

        case GET_CLOSE:
            return Object.assign({}, state, defaultFilters, { close: true });
            
        case GET_FAVOURITES:
            return Object.assign({}, state, defaultFilters, { favourites: true });

        case CACHED_FAVOURITES:
            return Object.assign({}, state, { favouritesList: action.payload });

        case ADD_FAVOURITE:
            let fs = [action.payload, ...state.favouritesList];
            return Object.assign({}, state, { favouritesList: fs });

        case REMOVE_FAVOURITE:
            let fs_ = state.favouritesList.filter(f => f !== action.payload)
            return Object.assign({}, state, { favouritesList: fs_ });

        default:
            return state;
    }
}
