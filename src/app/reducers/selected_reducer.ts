import { ActionReducer, Action } from '@ngrx/store';

import { NEW_FILTERS, GET_CLOSE } from './filters_reducer';

export const SELECT_RESTO = 'SELECT_RESTO';

// export const selectedReducer: ActionReducer<number> = (state: number = null, action: Action) => {
export function selectedReducer([current, previous]: Array<number> = [null, null], action: Action) {
    switch (action.type) {
        case SELECT_RESTO:
            console.log([current, previous], action);
            let curr = (action.payload === current) ? null : action.payload; 
            return [curr, current]
            // return (action.payload === state) ? null : action.payload;
        // When filters (inc. close) change, remove selected resto
        case NEW_FILTERS:
            return [null, current];
        case GET_CLOSE:
            return [null, current];

        default:
            return [current, previous];
    }
};
