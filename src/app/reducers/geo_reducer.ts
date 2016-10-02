import { ActionReducer, Action } from '@ngrx/store';

import { Location } from './geo';

export const GEO = 'GEO';

export const geoReducer: ActionReducer<Location> = (state: Location = [], action: Action) => {
    switch (action.type) {
        case GEO:
            // console.log('geoReducer', action.payload)
            return [action.payload];
        default: 
            return state;
    }
}
