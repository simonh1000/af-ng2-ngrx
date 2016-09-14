// restos.ts
import { ActionReducer, Action } from '@ngrx/store';
// import { Restos } from '../restos';
import { Resto } from '../resto';

export const DATA = 'DATA';

export const restosReducer: ActionReducer<Resto[]> = (state: Resto[] = [], action: Action) => {
    console.log("restosReducer", action)
    switch (action.type) {
        case DATA:
            return action.payload;

        default:
            return state;
    }
}
