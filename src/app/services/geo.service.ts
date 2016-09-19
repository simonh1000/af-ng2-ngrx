import { Injectable } from '@angular/core';
import { Dictionary } from '../filters/dictionary';
import { Store } from '@ngrx/store';
import { Point } from '../reducers/filters';
import { GEO } from '../reducers/filters_reducer';

@Injectable()
export class GeoService {

  constructor(private store: Store<Point>) {}

  getGeo() {
    console.log('Geo - constructor');

    navigator.geolocation.getCurrentPosition(pos => {
      // var inAmsterdam = true;
      let inAmsterdam =
        pos.coords.latitude > Dictionary.amsterdamBounds[0][0] &&
        (pos.coords.latitude < Dictionary.amsterdamBounds[1][0]) &&
        pos.coords.longitude > Dictionary.amsterdamBounds[0][1] &&
        (pos.coords.longitude < Dictionary.amsterdamBounds[1][1]);

      if (inAmsterdam) {
        console.log('restos.getGeo: user IN Amsterdam', pos.coords);
        this.store.dispatch({ type: GEO, payload: pos.coords });
      } else {
        console.log('restos.getGeo: user NOT in Amsterdam');
      }
    }, err => {
      console.log('Geo error: ', err);
    }, {
        timeout: 10 * 1000
      });
  }
}
