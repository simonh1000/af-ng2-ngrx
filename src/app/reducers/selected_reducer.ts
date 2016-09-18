// restos.ts
import { ActionReducer, Action } from '@ngrx/store';
// import { Restos } from '../restos';
import { Resto } from './resto';

export const SELECT_RESTO = 'SELECT_RESTO';

export const selectedReducer: ActionReducer<Resto[]> = (state: Resto[] = [], action: Action) => {
    // console.log(action);
    switch (action.type) {
        case SELECT_RESTO:
            return [action.payload];

        default:
            return state;
    }
}
