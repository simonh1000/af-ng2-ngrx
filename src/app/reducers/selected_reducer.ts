import { ActionReducer, Action } from '@ngrx/store';

import { Resto } from './resto';
import { NEW_FILTERS } from './filters_reducer';

export const SELECT_RESTO = 'SELECT_RESTO';

export const selectedReducer: ActionReducer<number> = (state: number = null, action: Action) => {
    switch (action.type) {
        case SELECT_RESTO:
            console.log(`SELECT_RESTO: new ${action.payload}, old ${state}`);
            return (action.payload === state) ? null : action.payload;
            // return (state[0] && action.payload.qname === state[0].qname) ? [] : [action.payload];
        case NEW_FILTERS:
            return null;
            // return [];

        default:
            return state;
    }
}
