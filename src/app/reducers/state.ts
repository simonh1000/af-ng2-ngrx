
import { Resto } from './resto';
import { Filters } from './filters';
import { Location } from './geo';

export interface AppState {
    restos : Resto[];       // included because is updated with distance info when geo location changes
    filters: Filters;
    selectedResto: string;  // qname
    mapReady: boolean;
    location: Location;
}
