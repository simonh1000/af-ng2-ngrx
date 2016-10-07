import { ActionReducer, Action } from '@ngrx/store';

import { GEO } from './geo_reducer';
import { Resto } from './resto';
import { setDistance } from '../filters/distances';

export const DATA = 'DATA';
export const TOGGLE = 'TOGGLE';

export const restosReducer: ActionReducer<Resto[]> = (state: Resto[] = [], action: Action) => {
  switch (action.type) {
    case DATA:
      return [...action.payload];
    case TOGGLE:
      return state.map(r => (r.qname === action.payload) ? Object.assign(r, { open: !r.open }) : r);
    case GEO:
      let distanceFn = setDistance(action.payload);
      return state.map(r => Object.assign(r, { distance: distanceFn(r) }));
    default:
      return state;
  }
};
