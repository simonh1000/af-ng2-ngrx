import { ActionReducer, Action } from '@ngrx/store';

export const MAP_READY = 'MAP_READY';

export const initMap = false;

// export const mapReducer: ActionReducer<boolean> = (state: boolean, action: Action) => {
export function mapReducer(state: boolean, action: Action) {
    switch (action.type) {
        case MAP_READY:
            return true;

        default:
            return state;
    }
}
