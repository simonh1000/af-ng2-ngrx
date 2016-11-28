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
        trigger('selectedRestoState', [
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
            transition('gone <=> load', animate('300ms')),
            transition('gone => gone', animate(0)),
            transition('* => *', animate('300ms'))
        ])
    ]
})
export class ListComponent implements OnChanges, OnInit {
    @Input() restos: Resto[];
    @Input() filters: Filters;
    @Input() selectedQName: Observable<string[]>;
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
        // Animations 
        this.selectedRestoState = 'gone';
        
        this.selectedResto =
            this.selectedQName
                // .distinct(arr => arr[0])

                .do( ([curr, prev]) => {
                    if (curr === null) {
                        return 
                        // return this.selectedRestoState = 'gone' 
                    }
                    if (prev !== null && curr !== prev) { 
                        return this.selectedRestoState = 'unload' ;
                    }
                })
                .delay(300)
                .do ( ([curr, _prev]) => {
                     return this.selectedRestoState = (curr === null) ? 'gone' : 'load';

                    // if (curr !== null) 
                    //     this.selectedRestoState = 'load';
                })
                .map( ([curr, _prev]) => {
                    let candidate = this.restos.filter(r => r.qname === curr)
                    return (candidate.length > 0) ? candidate[0] : null;
                });
  
        // this.selectedResto =
        //     this.selectedRestoIndex
        //         .do( ([curr, prev]) => {
        //             if (curr === null) { 
        //                 return this.selectedRestoState = 'gone' 
        //             }
        //             if (prev !== null && curr !== prev) { 
        //                 return this.selectedRestoState = 'unload' ;
        //             }
        //         })
        //         .delay(500)
        //         .do ( ([curr, _prev]) => this.selectedRestoState = (curr !== null) ? 'load' : 'gone' )
        //         .map( ([curr, _prev]) => this.restos[curr] );


}

    ngOnChanges(changes) {
        this.top5 = (toUrl(this.filters) === '' && this.restos.length > 0);
        if (this.top5) {
            this.rotm = this.restos[0];
            this.rotms = this.restos.slice(1);
        }
        this.title = filter_to_title(this.filters);
    }

    isFavourite(qname) {
        return this.filters.favouritesList.indexOf(qname) > -1;
    }
}
