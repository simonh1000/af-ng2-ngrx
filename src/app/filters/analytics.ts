declare var ga: any;

import { Filters } from '../reducers/filters';

export function sendAnalytics(filters: Filters) {
    // console.log('sending filter analytics');
    [search, area, cuisine, price].forEach(fn => fn(filters));
}

function search({search}: Filters) {
    if (search !== '') {
        ga('send', 'event', 'filters', 'resto_search', search);
    }
}

function area({location}: Filters) {
    if (location !== 'Amsterdam') {
        ga('send', 'event', 'filters', 'area', location);
    }
}

function cuisine({cuisine}: Filters) {
    if (cuisine !== 'all cuisines') {
        ga('send', 'event', 'filters', 'area', cuisine);
    }
}

function price({cuisine}: Filters) {
    ['budget', 'midrange', 'finedining'].forEach(t => {
        if (cuisine[t]) {
            ga('send', 'event', 'filters', 'price', t);
        }
    });
}

