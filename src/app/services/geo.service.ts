
import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';

import { Dictionary } from '../filters/dictionary';
// import { Point } from '../reducers/geo';
import { GEO, LOST_GEO } from '../reducers/geo_reducer';

@Injectable()
export class GeoService {

    constructor(private _ngZone: NgZone, private store: Store<Location>) { }

    getGeo() {
        console.log('Geo - constructor');

        navigator.geolocation.watchPosition(pos => {
            // var inAmsterdam = true;
            let inAmsterdam =
                pos.coords.latitude > Dictionary.amsterdamBounds[0][0] &&
                (pos.coords.latitude < Dictionary.amsterdamBounds[1][0]) &&
                pos.coords.longitude > Dictionary.amsterdamBounds[0][1] &&
                (pos.coords.longitude < Dictionary.amsterdamBounds[1][1]);

            if (inAmsterdam) {
                console.log('restos.getGeo: user IN Amsterdam', pos.coords);
                this._ngZone.run(() => {
                    this.store.dispatch({
                        type: GEO,
                        payload: {
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude
                        }
                    });
                });
            } else {
                console.log('restos.getGeo: user NOT in Amsterdam');
            }
        }, err => {
            console.log('Geo error: ', err);
            this._ngZone.run(() => {
                this.store.dispatch({
                    type: LOST_GEO
                });
            });
        }, {
                timeout: 10 * 1000
            });
    }
}
