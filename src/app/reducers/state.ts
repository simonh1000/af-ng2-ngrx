import { Resto } from './resto';
import { Filters } from './filters';
import { MaybePoint } from './geo';
import { Notices} from './notices_reducer';

export interface AppState {
    restos: Resto[];       // included because is updated with distance info when geo location changes
    filters: Filters;
    selectedQName: Array<string>;
    mapReady: number;
    myLocation: MaybePoint;
    notices: Notices;
}

    // favourites: Array<string>;