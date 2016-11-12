import {
    Component, OnChanges, OnInit, SimpleChanges,
    Input, Output, EventEmitter
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Filters } from '../reducers/filters';
import { NEW_FILTERS, GET_CLOSE } from '../reducers/filters_reducer';
import { MaybePoint } from '../reducers/geo';
import { Dictionary } from './dictionary';
import { sendAnalytics } from './analytics';

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnChanges {
    @Input() filters: Filters;
    @Input() location: MaybePoint;
    @Output() action = new EventEmitter();

    overlay: boolean = false;
    // Maps of dictionary to create select elements
    areas: Array<{ key: string, name: string }> = [];
    cuisines: Array<{ key: string, name: string }> = [];
    prices: Array<{ key: string, name: string, state: boolean }> = [];

    searchControl = new FormControl();
    cuisineControl = new FormControl();
    locationControl = new FormControl();
    priceControl = {
        budget: new FormControl(),
        midrange: new FormControl(),
        finedining: new FormControl()
    };

    constructor() {
        //   Create the selects data
        for (let k in Dictionary.areas) {
            if (k) {
                this.areas.push({ key: k, name: Dictionary.areas[k].name });
            }
        }

        this.cuisines.push({ key: 'all cuisines', name: 'All Cuisines' });
        for (let k in Dictionary.cuisines) {
            if (k) {
                this.cuisines.push({ key: k, name: Dictionary.cuisines[k].name })
            }
        }

        this.prices = Dictionary.prices.map(p => Object.assign(p, { state: false }));
    }

    ngOnInit() {
        // Set param values into filters
        this.filters2form(this.filters);
    }

    ngOnChanges(changes: SimpleChanges) {
        // Copies in e.g. effects of 'close'
        if (changes['filters']) {
            this.filters2form(this.filters);
        }
    }

    setSearch(s) {
        this.searchControl.setValue(s);
    }

    setCriteria($event: Event) {
        this.overlay = false;
        sendAnalytics(this.filters);

        this.action.emit({
            type: NEW_FILTERS,
            payload: this.form2filters()
        });
    }

    getClose() {
        this.overlay = false;
        // this.router.navigate(['/recommendations', 'close']);
        this.action.emit({
            type: GET_CLOSE
        });
    }

    form2filters(): Filters {
        return {
            search: this.searchControl.value,
            cuisine: this.cuisineControl.value,
            location: this.locationControl.value,
            close: false,
            budget: this.priceControl['budget'].value,
            midrange: this.priceControl['midrange'].value,
            finedining: this.priceControl['finedining'].value
        }
    }
    filters2form(f: Filters): void {
        this.searchControl.setValue(f.search);
        this.cuisineControl.setValue(f.cuisine);
        this.locationControl.setValue(f.location);
        this.priceControl['budget'].setValue(f.budget);
        this.priceControl['midrange'].setValue(f.midrange);
        this.priceControl['finedining'].setValue(f.finedining);
    }

}
