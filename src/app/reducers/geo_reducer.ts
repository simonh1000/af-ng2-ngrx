import { ActionReducer, Action } from '@ngrx/store';

import { MaybePoint } from './geo';

export const GEO = 'GEO';

export const geoReducer: ActionReducer<MaybePoint> = (state: MaybePoint = [], action: Action) => {
    switch (action.type) {
        case GEO:
            console.log('geoReducer', action.payload)
            return [action.payload];
        default:
            return state;
    }
}
