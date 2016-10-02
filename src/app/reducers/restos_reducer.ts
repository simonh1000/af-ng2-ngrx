import { ActionReducer, Action } from '@ngrx/store';

import { GEO } from './geo_reducer';
import { Resto } from './resto';
import { setDistance } from '../filters/distances';

export const DATA = 'DATA';
export const TOGGLE = 'TOGGLE';

export const restosReducer: ActionReducer<Resto[]> = (state: Resto[] = [], action: Action) => {
    // console.log('restosReducer', action.type);
    switch (action.type) {
        case DATA:
            return action.payload;
        case TOGGLE:
            // console.log('TOGGLE', state);
            return state.map(r => {
                if (r.qname === action.payload) {
                    return Object.assign(r, {open: !r.open});
                } else {
                    return r;
                }
            });
        case GEO:
            return state.map(setDistance(action.payload));

        default:
            return state;
    }
}
