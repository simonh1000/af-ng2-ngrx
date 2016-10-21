import { Component, OnInit, OnChanges, Input, Output, EventEmitter, 
    trigger, state, style, transition, animate
} from '@angular/core';

import { Resto } from '../reducers/resto';
import { toUrl } from '../filters/encoder';
import { Filters } from '../reducers/filters';
import { filter_to_title } from '../filters/filters_to_title';

@Component({
    selector: 'app-resto-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    animations: [
        trigger('selectedResto', [
            state('void', style({
                height: '0'
            })),
            state('unloading', style({
                opacity: '0'
            })),
            state('open', style({
                height: '*',
                opacity: '1'
            })),
            transition('void <=> open', animate('500ms')),
            transition('* => *', animate('300ms'))
        ])
    ]
})
export class ListComponent implements OnChanges {
    @Input() restos: Resto[];
    @Input() filters: Filters;
    @Input() selectedRestoIndex: number;
    @Output() action = new EventEmitter();

    top5: boolean;
    rotm: Resto;
    rotms: Resto[];
    selectedResto: Resto;
    title: string;
    selectedRestoState: string;

    constructor() { }

    ngOnChanges() {
        this.top5 = toUrl(this.filters) === '';
        if (this.top5) {
            this.rotm = this.restos[0];
            this.rotms = this.restos.slice(1);
        }
        this.title = filter_to_title(this.filters);

        // No selectedResto, but one selected
        if (!this.selectedResto && this.selectedRestoIndex !== undefined) {
            this.selectedRestoState = 'open';
            return this.selectedResto = this.restos[this.selectedRestoIndex];
        }

        if (this.selectedResto && this.selectedRestoIndex === null) {
            return this.selectedResto = null;
        }

        // If the restaurant has changed, rather than just got a new distance
        if (this.selectedResto.qname !== this.restos[this.selectedRestoIndex].qname) {
            console.log('OUT:', this.selectedResto.qname);
            this.selectedRestoState = 'unloading';
            setTimeout(() => {
                this.selectedResto = this.restos[this.selectedRestoIndex];
                console.log('IN:', this.selectedResto.qname);
                this.selectedRestoState = 'open';
            }, 500);
        } else {
            // If just the distance has changed, then update directly
            this.selectedResto = this.restos[this.selectedRestoIndex];
        }
    }
}
