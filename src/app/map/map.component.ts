/// <reference path="../../../typings/globals/google.maps/index.d.ts" />
declare var ga: any;

import { Component, OnInit, OnChanges, SimpleChange,
    Input, Output, ChangeDetectionStrategy,
    NgZone, EventEmitter
} from '@angular/core';
import { Resto } from '../reducers/resto';
import { Dictionary } from '../filters/dictionary';
import { MAP_READY } from '../reducers/map_reducer';
import { SELECT_RESTO } from '../reducers/selected_reducer';
import { Point, MaybePoint } from '../reducers/geo';

const MAX_ZOOM = 15;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit, OnChanges {
    @Input() restos: Resto[];
    @Input() selectedResto: number;
    @Input() location: MaybePoint;
    @Input() mapReady: boolean;
    @Output() action = new EventEmitter();

    map: google.maps.Map;
    markers: Array<google.maps.Marker> = [];
    prevLocation: google.maps.Circle;
    markersInitialised = false;

    constructor(private _ngZone: NgZone) { }

    ngOnInit() {
        if (typeof google !== 'undefined') {
            let d = Dictionary['amsterdamCenter'];
            let mapOptions = {
                zoom: 10,
                center: new google.maps.LatLng(d[0], d[1]),
                mapTypeControl: false,
            };
            this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            google.maps.event.addListenerOnce(this.map, 'idle',
                () => this._ngZone.run(() => this.action.next({ type: MAP_READY })));

            // Redraw myLocation when zoom changes to ensure remains visible
            google.maps.event.addListener(this.map, 'zoom_changed', () => this.handleLocation() );
        }
    }

    /* changes
    *      - restos: if only location / open changed, then do nothing
    *      - selectedResto: if restos unchanged, just redraw old and new resto
    *      - mapready: use to draw markers
    *      - location: redraw location
    */
    ngOnChanges(changes: { changes: SimpleChange }): void {
        // When the map is ready draw markers and location if available
        if (changes['mapReady'] && changes['mapReady'].currentValue) {
            // console.log('mapReady - draw markers and location');
            if (this.mapReady && this.restos.length > 0) {
                this.drawAll();
                this.fitMap(this.markers);
            }
            this.handleLocation();
            return;
        }

        if (this.mapReady) {
            console.log('map ngOnChanges', changes);

            // If location changed, then update myLocation
            // AND ignore changes to this.restos
            if (changes['location']) {
                return this.handleLocation();
            }

            // If selectedResto changed,...
            if (changes['selectedResto'] && changes['restos'] === undefined) {
                return this.redrawSelected(changes['selectedResto']);
            }

            if (changes['restos']) {
                if (changes['restos'].currentValue.length === 0 && changes['restos'].previousValue.length !== 0) {
                    this.markers.forEach(m => m.setMap(null));
                    this.markers = [];
                    return;
                }
                if (changes['restos'].currentValue.length !== 0 && changes['restos'].previousValue.length === 0) {
                    this.drawAll();
                    return this.fitMap(this.markers);
                }

                // ignore changes in .open
                // If we have changes to restos, we want to know whether the qnames have changed,
                // or just the 'open' / 'distance' fields
                let changedRestos =
                    changes['restos'].currentValue
                        .reduce((acc, r, idx) => {
                            if (changes['restos'].previousValue[idx] === null || 
                                (changes['restos'].previousValue[idx] && 
                                 r.qname !== changes['restos'].previousValue[idx].qname)) {
                                return [idx, ...acc];
                            } else { return acc; }
                        }, []);
                // console.log(changedRestos);

                if (changedRestos.length > 0) {
                    this.drawAll();
                    // When there are no results, we should not fitBounds
                    if (this.restos.length > 0) {
                        this.fitMap(this.markers);
                    }
                }
            }
        }
    }

    redrawSelected(change: SimpleChange) {
        if (change.previousValue === null) {
            // set currentValue marker to highlighted
            return this.drawOne(change.currentValue);
            // let i = change.currentValue;
            // return this.markers[i] = this.makeMarker(this.restos[i], i);
        }
        if (change.currentValue === null) {
            // Remove highlighting from
            return this.drawOne(change.previousValue);
            // let i = change.currentValue;
            // return this.markers[i] = this.makeMarker(this.restos[i], i);
        }
        this.drawOne(change.previousValue);
        this.drawOne(change.currentValue);
    }

    drawOne(i: number): void {
        this.markers[i].setMap(null);
        this.markers[i] = this.makeMarker(this.restos[i], i);
    }

    drawAll() {
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
                console.log('drawAll: No markers to draw');
            }
        }
    }

    makeMarker(r: Resto, idx: number): google.maps.Marker {
        let pos = new google.maps.LatLng(r.lat, r.lng);
        let iconColour =
            // (this.selectedResto && this.selectedResto === idx) ? '#aa0000' : '#aa94a1';
            (this.selectedResto === idx) ? '#aa0000' : '#aa94a1';
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
            (idxx => {
                // http://stackoverflow.com/questions/33564072/angular-2-0-mandatory-refresh-like-apply
                this._ngZone.run(() => this.action.next({ type: SELECT_RESTO, payload: idxx }));
                ga('send', 'event', 'mapclick', r.qname);
            }).bind(null, idx)
        );

        marker.setZIndex(100 - idx);
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

    fitMap(markers: google.maps.Marker[]): void {
        let mybounds = new google.maps.LatLngBounds();
        if (this.location[0]) {
            mybounds.extend(new google.maps.LatLng(this.location[0].lat, this.location[0].lng));
        }

        markers.forEach(marker => mybounds.extend(marker.getPosition()));
        this.map.fitBounds(mybounds);

        if (this.map.getZoom() > MAX_ZOOM) {
            this.map.setZoom(MAX_ZOOM);
        }
    }

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

        return new google.maps.Circle({
            strokeColor: '#000099',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: colour,
            fillOpacity: 0.35,
            center: pt,
            radius: radius,
            zIndex: 100
        });
    }

    handleLocation() {
        // console.log('location - if this.map, draw Location');
        if (this.prevLocation) {
            this.prevLocation.setMap(null);
        }

        if (this.location && this.location.length > 0) {
            let loc = this.location[0];
            let markerPos = new google.maps.LatLng(loc.lat, loc.lng);
            let marker = this.makeCircle(markerPos, '#66ccff', '#66ccff');
            marker.setMap(this.map);
            marker.setOptions({ zIndex: 100 });
            this.prevLocation = marker;
        }
    }
}
