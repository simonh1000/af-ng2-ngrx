/// <reference path="../../../typings/globals/google.maps/index.d.ts" />

import {
    Component, OnInit, OnChanges, SimpleChange,
    Input, Output, ChangeDetectionStrategy,
    NgZone, EventEmitter
} from '@angular/core';
import { Resto } from '../reducers/resto';
import { Dictionary } from '../filters/dictionary';
import { MAP_READY } from '../reducers/map_reducer';
import { SELECT_RESTO } from '../reducers/selected_reducer';
import { Point } from '../reducers/filters';

const MAX_ZOOM = 15;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
    @Input() restos: Resto[];
    @Input() selectedResto: Resto;
    @Input() location: Point;
    @Output() action = new EventEmitter();

    map: google.maps.Map;
    markers: Array<google.maps.Marker> = [];
    // markers: Array<any> = [];
    prevLocation: google.maps.Circle;
    markersInitialised = false;

    constructor(private _ngZone: NgZone) { }

    ngOnInit() {
        let d = Dictionary['amsterdamCenter'];
        if (typeof google !== 'undefined') {
            let mapOptions = {
                zoom: 10,
                center: new google.maps.LatLng(d[0], d[1]),
                mapTypeControl: false,
            };
            this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            google.maps.event.addListenerOnce(this.map, 'idle',
                () => {
                    console.log('map idle');
                    this._ngZone.run(() => this.action.next({ type: MAP_READY }))
                }
            );
            google.maps.event.addListener(this.map, 'zoom_changed',
                // get location of marker and pass that to addMyLocation
                () => {
                    console.log('Zoom:', this.map.getZoom());
                    if (this.prevLocation) {
                        let l = this.prevLocation.getCenter();
                        this.addMyLocation({ lat: l.lat(), lng: l.lng() });
                    }
                }
            );
        }
    }

    ngOnChanges(changes: { changes: SimpleChange }) {
        console.log('map.onChanges', changes);
        // if (this.map && changes['restos'].currentValue.length > 0) {
        if (this.map && this.restos.length > 0) {
            this.addRestos(changes);
            this.fitMap(this.markers);
        }

        if (this.map && changes['location'] && changes['location'].currentValue.lat > 0) {
            this.addMyLocation(changes['location'].currentValue);
        }
    }

    // addRestos(changes: { changes: SimpleChange }) {
    //     let newRestos: Resto[] = changes['restos'].currentValue;
    //     let oldRestos: Resto[] = changes['restos'].previousValue;

    //     if (!this.markersInitialised) {
    //         newRestos.forEach((r, idx) => {
    //             let marker = this.makeMarker(r, idx);
    //             this.markers.push(marker);
    //             this.markersInitialised = true;
    //         });
    //     } else {
    //         oldRestos.forEach( (oldResto, idx) => {
    //             let newResto = newRestos[idx];
    //             // Various reasons why the marker should be redrawn

    //             // It was selected, but is no longer: is red but no selectedResto
    //             if ( (this.selectedResto.qname === newResto.qname && this.selectedResto.qname !== oldResto.qname) ||
    //                     this.selectedResto.qname === oldResto.qname ||
    //                     oldResto.qname !== newResto.qname ||
    //                     oldResto.open !== newResto.open) {

    //                 this.markers[idx].setMap(null);
    //                 return this.markers[idx] = this.makeMarker(newResto, idx);
    //             }

    //             if (!newResto) {
    //                 this.markers[idx].setMap(null);
    //                 this.markers[idx] = null;
    //             }
    //         });
    //         this.markers = this.markers.filter( m => m !== null);
    //     }
    // }

    addRestos(changes: { changes: SimpleChange }) {
        // let newRestos: Resto[] = changes['restos'].currentValue;

        if (!this.markersInitialised) {
            this.restos.forEach((r, idx) => {
            // newRestos.forEach((r, idx) => {
                let marker = this.makeMarker(r, idx);
                this.markers.push(marker);
            });
            this.markersInitialised = true;
        } else {
            // Remove any existing markers from map, and then from state
            this.markers.forEach(m => m.setMap(null));
            this.markers = [];

            if (this.restos.length > 0) {
                this.restos.forEach((r, idx) => {
                // newRestos.forEach((r, idx) => {
                    let marker = this.makeMarker(r, idx);
                    this.markers.push(marker);
                });
            } else {
                console.log('addRestos: No markers to draw');
            }
        }
    }

    fitMap(markers: google.maps.Marker[]): void {
        let mybounds = new google.maps.LatLngBounds();

        markers.forEach(marker => mybounds.extend(marker.getPosition()) );
        this.map.fitBounds(mybounds);

        if (this.map.getZoom() > MAX_ZOOM) {
            this.map.setZoom(MAX_ZOOM);
        }
        // console.log('Zoom:', this.map.getZoom());
    }

    makeMarker(r: Resto, idx: number): google.maps.Marker {
        let pos = new google.maps.LatLng(r.lat, r.lng);
        let iconColour =
            (this.selectedResto && this.selectedResto.qname === r.qname) ? '#aa0000' : '#aa94a1';
            // ((this.selectedResto && r.qname === this.selectedResto.qname) || r.open) ? '#aa0000' : '#aa94a1';
        let label = String.fromCharCode('A'.charCodeAt(0) + idx);

        let marker = new google.maps.Marker({
            position: pos,
            label: label,
            icon: this.pinSymbol(iconColour),
            zIndex: 100 - idx
        });
        google.maps.event.addListener(
            marker,
            'click',
            (resto => {
                // http://stackoverflow.com/questions/33564072/angular-2-0-mandatory-refresh-like-apply
                this._ngZone.run(() => this.action.next({ type: SELECT_RESTO, payload: resto }));
                // console.log(resto);
            }).bind(null, r)
        );

        marker.setMap(this.map);
        return marker;
    }

    pinSymbol(color) {
        return {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 1,
            scale: 1,
            labelOrigin: new google.maps.Point(0, -29)
        };
    }
    // makeCircle(pt: Point): google.maps.Circle {
    /* Zoom = 12 => 160
     * Zoom = 13 => 100;
     * Zoom = 14 => 60
     */
    makeCircle(pt: google.maps.LatLng, colour: string, label: string): google.maps.Circle {
        let radius;
        switch (this.map.getZoom()) {
            case 21: radius = 2; break;
            case 20: radius = 4; break;
            case 19: radius = 6; break;
            case 18: radius = 8; break;
            case 17: radius = 10; break;
            case 16: radius = 15; break;
            case 15: radius = 30; break;
            case 14: radius = 60; break;
            case 13: radius = 100; break;
            case 12: radius = 160; break;
            case 11: radius = 210; break;
            case 10: radius = 240; break;
        }
        console.log('radius', radius);

        return new google.maps.Circle({
            strokeColor: '#000099',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: colour,
            fillOpacity: 0.35,
            center: pt,
            radius: radius,
            zIndex: 600
        });
    }

    addMyLocation(loc: Point) {
        if (this.prevLocation) {
            this.prevLocation.setMap(null);
        }
        let markerPos = new google.maps.LatLng(loc.lat, loc.lng);
        let marker = this.makeCircle(markerPos, '#66ccff', '');
        marker.setMap(this.map);
        this.prevLocation = marker;
    }
}
