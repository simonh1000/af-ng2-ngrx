declare var ga: any;

import { ActionReducer, Action } from '@ngrx/store';

import { NEW_FILTERS, GET_CLOSE, GET_FAVOURITES, REMOVE_FAVOURITE } from './filters_reducer';

export const SELECT_RESTO = 'SELECT_RESTO';

export function selectedReducer(state: Array<string> = [null, null], action: Action) {
    switch (action.type) {
        case SELECT_RESTO:
            // console.log(state, action);
            if (action.payload === state[0]) {
                return [null, state[0]]
            } else {
                ga('send', 'event', 'mapclick', action.payload);
                return [action.payload, state[0]];
            }

        // When filters (inc. close) change, remove selected resto
        case NEW_FILTERS:
            return [null, state[0]];
        case GET_CLOSE:
            return [null, state[0]];
        case GET_FAVOURITES:
            return [null, state[0]];

        case REMOVE_FAVOURITE:
            // if currently selectedResto is unfavourited then unselectIt
            // this should ony actually trigger when on the favourites filter
            if (state[0] === action.payload) {
                return [null, state[0]];
            } else {
                return state;
            }

        default:
            return state;
    }
};
