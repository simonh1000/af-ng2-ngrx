declare var ga: any;

import { Component, Input, Output, OnInit, OnChanges, SimpleChange, EventEmitter, NgZone } from '@angular/core';

import { Resto } from '../reducers/resto';
import { Dictionary } from '../filters/dictionary';
import { MAP_READY, MAP_CODE_READY } from '../reducers/map_reducer';
import { SELECT_RESTO } from '../reducers/selected_reducer';
import { Point, MaybePoint } from '../reducers/geo';

const MAX_ZOOM = 15;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
    @Input() restos: Resto[];
    @Input() selectedQName: string[];
    @Input() location: MaybePoint;
    @Input() mapReady: number;
    @Output() action = new EventEmitter();

    map: google.maps.Map;
    markers: Array<google.maps.Marker> = [];
    locationMarker: google.maps.Circle;
    markersInitialised = false;
    amsterdamCenter: google.maps.LatLng;

    constructor(private _ngZone: NgZone) { 
        let d = Dictionary['amsterdamCenter'];
        // 'amsterdamCenter': [52.37, 4.895]
        this.amsterdamCenter = new google.maps.LatLng(d[0], d[1]);
    }

    // Component only initialised when MAP_CODE_READY
    ngOnInit() {
        if (typeof google !== 'undefined') {
            this.loadMap();
        } else {
            console.error('**** MapComponent.ngOnInit called when google not ready ****');
        }
    }

    loadMap() {

        let mapOptions = {
            zoom: 10,
            center: this.amsterdamCenter,
            mapTypeControl: false,
        };
        this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        google.maps.event.addListenerOnce(this.map, 'idle',
            () => this._ngZone.run(() => this.action.next({ type: MAP_READY })));

        // Redraw myLocation when zoom changes to ensure remains visible
        google.maps.event.addListener(this.map, 'zoom_changed', () => this.handleLocation() );

        this.locationMarker = this.makeCircle(this.amsterdamCenter, '#66ccff', '#66ccff');

        this.markers = Array(20).fill('').map( (dummy, idx) => this.makeMarker2(idx));
    }

    /* changes
    *      - restos: if only location / open changed, then do nothing
    *      - selectedResto: if restos unchanged, just redraw old and new resto
    *      - mapready: use to draw markers
    *      - location: redraw location
    */
    ngOnChanges(changes: { changes: SimpleChange }): void {
        if (this.mapReady < 2) {
            return;
        }
        // console.log('map.ngOnChanges', changes);

        // When the map is ready draw markers and location if available
        if (changes['mapReady']) {
            this.updateMarkers(this.restos, []);
            // if (this.mapReady && this.restos.length > 0) {
            //     this.drawAll();
            //     this.fitMap(this.markers);
            // }
            this.handleLocation();
            // return;
        }

        // If location changed, then update myLocation.
        // Do NOT stop further execution as restos ordering may have changes
        if (changes['location']) {
            this.handleLocation();
        }

        // If selectedResto changed,...
        if (changes['selectedQName'] && changes['restos'] === undefined) {
            return this.redrawSelected();
        }

        if (changes['restos']) {
            this.updateMarkers(changes['restos'].currentValue, changes['restos'].previousValue);
            // if (changes['restos'].currentValue.length === 0 && changes['restos'].previousValue.length !== 0) {
            //     this.markers.forEach(m => m.setMap(null));
            //     this.markers = [];
            //     return;
            // }

            // if (changes['restos'].currentValue.length !== 0 && changes['restos'].previousValue.length === 0) {
            //     this.drawAll();
            //     return this.fitMap(this.markers);
            // }

            // // If we have changes to restos, we want to know whether the qnames have changed,
            // // or just the 'open' / 'distance' fields
            // let changedRestos =
            //     changes['restos'].currentValue
            //         .reduce((acc, r, idx) => {
            //             if (changes['restos'].previousValue[idx] === null || 
            //                 (changes['restos'].previousValue[idx] && 
            //                     r.qname !== changes['restos'].previousValue[idx].qname)) {
            //                 return [idx, ...acc];
            //             } else { return acc; }
            //         }, []);
            // // console.log(changedRestos);

            // if (changedRestos.length > 0) {
            //     this.drawAll();
            //     // When there are no results, we should not fitBounds
            //     if (this.restos.length > 0) {
            //         this.fitMap(this.markers);
            //     }
            // }
        }
    }

    updateMarkers(curr, prev) {
        let changedRestosCount = 0;

        this.markers.forEach( (marker, idx) => {
            let resto = curr[idx]
            // if this index no longer maps to a resto
            if (typeof resto === 'undefined') {
                marker.setPosition(this.amsterdamCenter);
                return marker.setMap(null);
            }

            if (!prev[idx] || resto.qname !== prev[idx].qname) {
                let pos = new google.maps.LatLng(resto.lat, resto.lng);
                // console.log('makeMarker', this.selectedQName, idx);
                let iconColour =
                    (this.getIndex(this.selectedQName[0]) === idx) ? '#aa0000' : '#aa94a1';
                
                marker.setPosition(pos);
                marker.setIcon(this.pinSymbol(iconColour));
                marker.setMap(this.map);
                changedRestosCount++;
            }
        })

        if (changedRestosCount > 0) {
            this.fitMap(this.markers);
        }
    }

    getIndex(qname): number {
        return this.restos.findIndex(r => r.qname === qname);
    }

    redrawSelected() {
        // if no previous selectedResto, then just turn on current one
        if (this.selectedQName[1] === null) {
            return this.drawOne(this.getIndex(this.selectedQName[0]));
        }
        // There was a previous selectedResto
        // if no current selectedResto, then turn off previous
        if (this.selectedQName[0] === null) {
            return this.drawOne(this.getIndex(this.selectedQName[1]));
        }

        // Previous and current are set
        // turn off old, turn on new
        this.drawOne(this.getIndex(this.selectedQName[1]));
        this.drawOne(this.getIndex(this.selectedQName[0]));;
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

    sendSelectedResto(idx) {
        this.action.next({ type: SELECT_RESTO, payload: this.restos[idx].qname })
    }

    makeMarker(r: Resto, idx: number): google.maps.Marker {
        let pos = new google.maps.LatLng(r.lat, r.lng);
        // console.log('makeMarker', this.selectedQName, idx);
        let iconColour =
            (this.getIndex(this.selectedQName[0]) === idx) ? '#aa0000' : '#aa94a1';
            // (this.selectedResto && this.selectedResto === idx) ? '#aa0000' : '#aa94a1';
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
                // this._ngZone.run(() => this.action.next({ type: SELECT_RESTO, payload: r.qname }));
                this._ngZone.run( () => this.sendSelectedResto(idxx) );
            }).bind(null, idx)
        );

        marker.setZIndex(100 - idx);
        marker.setMap(this.map);
        return marker;
    }

    makeMarker2(idx: number): google.maps.Marker {
        let label = String.fromCharCode('A'.charCodeAt(0) + idx);

        let marker = new google.maps.Marker({
            position: this.amsterdamCenter,
            label: label,
            icon: this.pinSymbol('#aa94a1'),
            zIndex: 100 - idx
        });

        google.maps.event.addListener(
            marker,
            'click',
            (idxx => {
                // http://stackoverflow.com/questions/33564072/angular-2-0-mandatory-refresh-like-apply
                // this._ngZone.run(() => this.action.next({ type: SELECT_RESTO, payload: r.qname }));
                this._ngZone.run( () => this.sendSelectedResto(idxx) );
            }).bind(null, idx)
        );

        marker.setZIndex(100 - idx);
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

        markers.filter(m => m.getMap())
            .forEach(marker => mybounds.extend(marker.getPosition()));
            
        this.map.fitBounds(mybounds);

        if (this.map.getZoom() > MAX_ZOOM) {
            this.map.setZoom(MAX_ZOOM);
        }
    }

    makeCircle(pt: google.maps.LatLng, colour: string, label: string): google.maps.Circle {
        return new google.maps.Circle({
            strokeColor: '#000099',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: colour,
            fillOpacity: 0.35,
            center: pt,
            radius: this.getRadius(),
            zIndex: 100
        });
    }

    getRadius(): number {
        switch (this.map.getZoom()) {
            case 21: return 2;
            case 20: return 4;
            case 19: return 6;
            case 18: return 8;
            case 17: return 10;
            case 16: return 15;
            case 15: return 30;
            case 14: return 60;
            case 13: return 100;
            case 12: return 160;
            case 11: return 210;
            case 10: return 300;
        }
    }

    handleLocation() {
        if (this.location && this.location.length > 0) {
            let loc = this.location[0];
            let markerPos = new google.maps.LatLng(loc.lat, loc.lng);
            this.locationMarker.setCenter(markerPos);
            this.locationMarker.setRadius(this.getRadius());
            this.locationMarker.setMap(this.map);
            this.locationMarker.setOptions({ zIndex: 100 });
        } else {
            this.locationMarker.setMap(null);
        }
    }
}
