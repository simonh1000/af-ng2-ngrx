import { Component, OnInit, OnChanges, Input, Output, EventEmitter, 
    trigger, state, style, transition, animate
} from '@angular/core';

import { Observable } from 'rxjs';

import { Resto } from '../reducers/resto';
import { Filters } from '../reducers/filters';
import { toUrl } from '../filters/encoder';
import { filter_to_title } from '../filters/filters_to_title';

@Component({
    selector: 'app-resto-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    animations: [
        trigger('selectedResto', [
            state('gone', style({
                height: '0'
            })),
            state('unload', style({
                opacity: '0'
            })),
            state('load', style({
                height: '*',
                opacity: '1'
            })),
            transition('gone <=> load', animate('500ms')),
            transition('gone => gone', animate(0)),
            transition('* => *', animate('300ms'))
        ])
    ]
})
export class ListComponent implements OnChanges, OnInit {
    @Input() restos: Resto[];
    @Input() filters: Filters;
    // @Input() selectedRestoIndex: number;
    @Input() selectedRestoIndex: Observable<number>;
    @Output() action = new EventEmitter();

    top5: boolean;
    rotm: Resto;
    rotms: Resto[];
    // selectedResto: Resto;
    selectedResto: Observable<Resto>;
    title: string;
    selectedRestoState: string;

    constructor() {  }

    ngOnInit() {
        this.selectedRestoState = 'gone';
        // Animations 
        
        this.selectedResto =
            this.selectedRestoIndex
                // .distinct(arr => arr[0])
                // this.selectedRestoState = (curr && prev) ? 'unload' : 'gone' )
                .do( ([curr, prev]) => {
                    // console.log([curr, prev]);
                    if (curr === null) { 
                        // console.log('curr == null => "gone"');
                        return this.selectedRestoState = 'gone' 
                    }
                    if (prev !== null && curr !== prev) { 
                        // console.log('prev && curr !== prev ==> unload');
                        return this.selectedRestoState = 'unload' ;
                    }
                })
                .delay(500)
                .do ( ([curr, _prev]) => this.selectedRestoState = (curr !== null) ? 'load' : 'gone' )
                .map( ([curr, _prev]) => this.restos[curr] );
    }

    ngOnChanges(changes) {
        // console.log(changes);

        this.top5 = toUrl(this.filters) === '';
        if (this.top5 && this.restos.length > 0) {
            this.rotm = this.restos[0];
            this.rotms = this.restos.slice(1);
        }
        this.title = filter_to_title(this.filters);

        // // No selectedResto, but one selected
        // if (!this.selectedResto && this.selectedRestoIndex !== undefined) {
        //     this.selectedRestoState = 'load';
        //     return this.selectedResto = this.restos[this.selectedRestoIndex];
        // }

        // if (this.selectedResto && this.selectedRestoIndex === null) {
        //     this.selectedRestoState = 'gone';
        //     return this.selectedResto = null;
        // }

        // // If the restaurant has changed, rather than just got a new distance
        // if (this.selectedResto.qname !== this.restos[this.selectedRestoIndex].qname) {
        //     console.log('OUT:', this.selectedResto.qname);
        //     this.selectedRestoState = 'unload';
        //     setTimeout(() => {
        //         this.selectedResto = this.restos[this.selectedRestoIndex];
        //         console.log('IN:', this.selectedResto.qname);
        //         this.selectedRestoState = 'load';
        //     }, 500);
        // } else {
        //     // If just the distance has changed, then update directly
        //     this.selectedResto = this.restos[this.selectedRestoIndex];
        // }
    }
}
