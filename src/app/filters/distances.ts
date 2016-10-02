import { Point } from '../reducers/geo';
import { Resto } from '../reducers/resto';

function scorer(d, r): number {
    let dd = Math.max(0, 5 - d);
    return r + dd;
}

export function setDistance(pt: Point) {
    return function(r: Resto): Resto {
            let distance = getDistance(pt.lat, pt.lng, r.lat, r.lng) / 1000;
            return Object.assign(r, {
                distance: distance
            });
        };
}

function getDistance(lat1, lng1, lat, lng) {
    function rad(x) {
        return x * Math.PI / 180;
    }
    let R = 6378137; // Earth’s mean radius in meter
    let dLat = rad(lat - lat1);
    let dLong = rad(lng - lng1);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(lat1)) * Math.cos(rad(lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d; // returns the distance in meter
}
