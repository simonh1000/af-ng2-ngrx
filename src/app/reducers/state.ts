
import { Resto } from './resto';
import { Filters } from './filters';
import { MaybePoint } from './geo';

export interface AppState {
    restos: Resto[];       // included because is updated with distance info when geo location changes
    filters: Filters;
    selectedResto: number;
    mapReady: boolean;
    myLocation: MaybePoint;
}
