import { ActionReducer, Action } from '@ngrx/store';

import { Resto } from './resto';
import { NEW_FILTERS } from './filters_reducer';

export const SELECT_RESTO = 'SELECT_RESTO';

export const selectedReducer: ActionReducer<Resto[]> = (state: Resto[] = [], action: Action) => {
    switch (action.type) {
        case SELECT_RESTO:
            return (state[0] && action.payload.qname === state[0].qname) ? [] : [action.payload];
        case NEW_FILTERS:
            return [];

        default:
            return state;
    }
}
