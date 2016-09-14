// filters.ts
import { ActionReducer, Action } from '@ngrx/store';
import { Filters } from './filters';

export const SWITCH = 'SWITCH';

export const filtersReducer: ActionReducer<Filters> = (state: Filters, action: Action) => {
    console.log("filtersReducer", action)
    switch (action.type) {
        case SWITCH:
            if (state.count == 2) {
                return { count: 1 }
            } else return { count: 2 };

        default:
            return state;
    }
}
