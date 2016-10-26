import { ActionReducer, Action } from '@ngrx/store';

import { NEW_FILTERS, GET_CLOSE } from './filters_reducer';

export const SELECT_RESTO = 'SELECT_RESTO';

// export const selectedReducer: ActionReducer<number> = (state: number = null, action: Action) => {
export function selectedReducer(state: number = null, action: Action) {
    switch (action.type) {
        case SELECT_RESTO:
            return (action.payload === state) ? null : action.payload;
        // When filters (inc. close) change, remove selected resto
        case NEW_FILTERS:
            return null;
        case GET_CLOSE:
            return null;

        default:
            return state;
    }
};
