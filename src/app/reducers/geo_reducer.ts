import { ActionReducer, Action } from '@ngrx/store';

import { MaybePoint } from './geo';

export const GEO = 'GEO';
export const LOST_GEO = 'LOST_GEO';

// export const geoReducer: ActionReducer<MaybePoint> = (state: MaybePoint = [], action: Action) => {
export function geoReducer(state: MaybePoint = [], action: Action) {
    switch (action.type) {
        case GEO:
            return [action.payload];
        case LOST_GEO:
            return [];
        default:
            return state;
    }
}
