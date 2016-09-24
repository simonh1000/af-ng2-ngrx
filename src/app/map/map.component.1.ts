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

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
    @Input() restos: Resto[];
    @Input() selectedResto: Resto;
    @Output() action = new EventEmitter();

    map: google.maps.Map;
    // markers: Array<google.maps.Marker> = [];
    markers: Array<any> = [];

    constructor(private _ngZone: NgZone) { }

    ngOnInit() {
        let d = Dictionary['amsterdamCenter'];
        let mapOptions = {
            zoom: 10,
            center: new google.maps.LatLng(d[0], d[1])
        };
        this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        google.maps.event.addListenerOnce(this.map, 'idle',
            () => (this._ngZone.run(() => this.action.next({ type: MAP_READY }))));
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        console.log('map.onChanges');
        if (this.map) {
            this.addRestos();
        }
    }

    addRestos() {
        // Remove any existing markers
        if (this.markers.length) {
            this.markers.forEach(m => m.setMap(null));
            this.markers = [];
        }

        if (this.restos.length > 0) {
            let mybounds = new google.maps.LatLngBounds();

            this.restos.forEach((r, idx) => {
                let markerPos = new google.maps.LatLng(r.lat, r.lng);
                let l = String.fromCharCode('A'.charCodeAt(0) + idx);
                let iconColour =
                        // '/aa94a1/'
                        // (this.selectedResto && r.qname === this.selectedResto.qname) ? '/aa0000/' : '/aa94a1/';
                        (this.selectedResto && r.qname === this.selectedResto.qname) ? '#aa0000' : '#aa94a1';

                // let marker = this.makeCircle(markerPos, iconColour, l);
                let marker = this.makeMarker(markerPos, iconColour, l);
                this.markers.push(marker);

                google.maps.event.addListener(
                    this.markers[idx],
                    'click',
                    (resto => {
                        // http://stackoverflow.com/questions/33564072/angular-2-0-mandatory-refresh-like-apply
                        // this.ngZone.run( () => this.select.next(i) );
                        this._ngZone.run(() => this.action.next({ type: SELECT_RESTO, payload: resto }));
                        // this.action.next({type: SELECT_RESTO, payload: resto});
                        console.log(resto);
                    }).bind(null, r)
                );

                marker.setMap(this.map);
                mybounds.extend(markerPos);
            });

            this.map.fitBounds(mybounds);
            if (this.map.getZoom() > 13) {
                this.map.setZoom(13);
            }
        } else {
            console.log('addRestos: No markers to draw');
        }
    }

    makeMarker(latlng: google.maps.LatLng, colour: string, label: string): google.maps.Marker {
        // let markerLabel = new google.maps.MarkerLabel({

        // })
        // return new google.maps.Marker({
        //     // title: r.rname,
        //     position: pt,
        //     color: colour,
        //     // icon: 'http://www.googlemapsmarkers.com/v1/' + l + iconColour,
        //     label: label
        // });

        return new google.maps.Marker({
            position: latlng,
            label: label,
            icon: this.pinSymbol(colour)
        });

    }

    pinSymbol(color) {
        return {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 1,
            scale: 1,
            labelOrigin: new google.maps.Point(0,-29)
        };
    }
    // makeCircle(pt: Point): google.maps.Circle {
    makeCircle(pt: google.maps.LatLng, colour: string, label: string): google.maps.Circle {
        return new google.maps.Circle({
            // strokeColor: '#FF0000',
            // strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: colour,
            fillOpacity: 0.35,
            center: pt,
            radius: 60
        });
    }
}
