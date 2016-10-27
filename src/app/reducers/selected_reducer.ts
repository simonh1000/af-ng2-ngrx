import { ActionReducer, Action } from '@ngrx/store';

import { NEW_FILTERS, GET_CLOSE } from './filters_reducer';

export const SELECT_RESTO = 'SELECT_RESTO';

// export const selectedReducer: ActionReducer<number> = (state: number = null, action: Action) => {
export function selectedReducer(state: Array<number> = [null, null], action: Action) {
    switch (action.type) {
        case SELECT_RESTO:
            // console.log(state, action);
            let curr = (action.payload === state[0]) ? null : action.payload; 
            return [curr, state[0]]
            // return (action.payload === state) ? null : action.payload;
        // When filters (inc. close) change, remove selected resto
        case NEW_FILTERS:
            return [null, state[0]];
        case GET_CLOSE:
            return [null, state[0]];

        default:
            return state;
    }
};
