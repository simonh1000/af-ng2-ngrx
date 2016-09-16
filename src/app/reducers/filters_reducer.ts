// filters.ts
import { ActionReducer, Action } from '@ngrx/store';
import { Filters } from './filters';

export const SWITCH = 'SWITCH';
export const NEW_FILTERS = 'NEW_FILTERS';

export const initFilters = {
    search: "",
    location: "all areas",
    cuisine: "all cuisines",
    price: [1,2,3],
    count: 1
}

export const filtersReducer: ActionReducer<Filters> = (state: Filters = initFilters, action: Action) => {
    console.log("filtersReducer", action)
    switch (action.type) {
        case SWITCH:
            if (state.count == 2) {
                return Object.assign(state, { count: 1 })
            } else return Object.assign(state, { count: 2 });
        case NEW_FILTERS:
            return action.payload;
            // return filtersReducer(action.payload, {type: SWITCH})

        default:
            return state;
    }
}
