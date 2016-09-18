// filters.ts
import { ActionReducer, Action } from '@ngrx/store';
import { Filters } from './filters';

export const SWITCH = 'SWITCH';
export const NEW_FILTERS = 'NEW_FILTERS';

export const initFilters : Filters = {
    search: "",
    location: "Amsterdam",
    cuisine: "all cuisines",
    budget: false,
    midrange: false,
    finedining: false,
    count: 1
}

export const filtersReducer: ActionReducer<Filters> = (state: Filters = initFilters, action: Action) => {
    switch (action.type) {
        case NEW_FILTERS:
            console.log("filtersReducer", action)
            if (state.count == 2) {
                return Object.assign(action.payload, { count: 1 })
            } else return Object.assign(action.payload, { count: 2 });

        default:
            return state;
    }
}
