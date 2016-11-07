import { ActionReducer, Action } from '@ngrx/store';

export const MAP_READY = 'MAP_READY';
export const MAP_CODE_READY = 'MAP_CODE_READY';

export const initMap = false;

// export const mapReducer: ActionReducer<boolean> = (state: boolean, action: Action) => {
export function mapReducer(state: number = 0, action: Action) {
    switch (action.type) {
        case MAP_CODE_READY:
            return 1;
        case MAP_READY:
            return 2;

        default:
            return state;
    }
}
