import { Resto } from './resto';
import { Filters } from './filters';

export interface AppState {
    restos: Resto[],
    filters: Filters,
    selectedResto: Resto[]
}
