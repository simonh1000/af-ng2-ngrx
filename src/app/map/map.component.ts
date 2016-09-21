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

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
    @Input() restos: Resto[];
    // @Input() selectedResto: Resto;
    @Output() action = new EventEmitter();

    map: google.maps.Map;
    markers: Array<google.maps.Marker> = [];

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
            this.makeMarkers();
        }
    }

    makeMarkers() {
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
                // let iconColour = (r.qname === this.selectedResto.qname) ? '/aa9090/' : '/aa94a1/';
                let icon = 'http://www.googlemapsmarkers.com/v1/' + l + '/aa94a1/';

                let marker = new google.maps.Marker({
                    title: r.rname,
                    position: markerPos,
                    icon: icon
                });
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
            console.log('makeMarkers: No markers to draw');
        }
    }

}
