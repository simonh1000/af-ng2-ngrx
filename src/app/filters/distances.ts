import { Point } from '../reducers/geo';
import { Resto } from '../reducers/resto';

export function setDistance(pt: Point): (Resto) => number {
    return r => getDistance(pt.lat, pt.lng, r.lat, r.lng) / 1000;
}

function getDistance(lat1, lng1, lat, lng): number {
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
    return R * c; // returns the distance in meter
}
