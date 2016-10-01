import { Resto } from './resto';
import { Filters } from './filters';

export interface AppState {
    filters: Filters;
    selectedResto: number;
    mapReady: boolean;
}
