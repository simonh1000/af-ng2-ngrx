import { ActionReducer, Action } from '@ngrx/store';

import { GEO } from './geo_reducer';
import { Resto } from './resto';
import { setDistance } from '../filters/distances';

export const DATA = 'DATA';
export const TOGGLE = 'TOGGLE';

// restosReducer : ActionReducer<Resto[]>
export function restosReducer(state: Resto[] = [], action: Action) {
// export const restosReducer: ActionReducer<Resto[]> = (state: Resto[] = [], action: Action) => {
  switch (action.type) {
    case DATA:
      return [...action.payload];
    case TOGGLE:
      return toggleResto(action.payload, state);
      // return state.map(r => (r.qname === action.payload) ? Object.assign(r, { open: !r.open }) : r);
    case GEO:
      return setDistances(action.payload, state);
      // let distanceFn = setDistance(action.payload);
      // return state.map(r => Object.assign(r, { distance: distanceFn(r) }));
    default:
      return state;
  }
};

function toggleResto(qname, restos) {
  return restos.map(r => (r.qname === qname) ? Object.assign(r, { open: !r.open }) : r);
}

function setDistances(loc, restos) {
      let distanceFn = setDistance(loc);
      return restos.map(r => Object.assign(r, { distance: distanceFn(r) }));  
}