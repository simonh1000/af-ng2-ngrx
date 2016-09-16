// restos.ts
import { ActionReducer, Action } from '@ngrx/store';
// import { Restos } from '../restos';
import { Resto } from './resto';

export const DATA = 'DATA';
export const TOGGLE = 'TOGGLE';

export const restosReducer: ActionReducer<Resto[]> = (state: Resto[] = [], action: Action) => {
    // console.log(action);
    switch (action.type) {
        case DATA:
            return action.payload;
        case TOGGLE:
            console.log('TOGGLE', state)
            return state.map(r => {
                if (r.name == action.payload) { 
                    return Object.assign(r, {open: !r.open})
                } else return r
            });

        default:
            return state;
    }
}
