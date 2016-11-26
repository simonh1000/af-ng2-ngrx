import { Action } from '@ngrx/store';

import { FormFilters } from '../reducers/filters';
import { defaultFilters, NEW_FILTERS, GET_CLOSE, GET_FAVOURITES } from '../reducers/filters_reducer';
import { Dictionary } from './dictionary';

export function fromUrl(urlString: string): Action {
    console.log('fromUrl', urlString);
    switch (urlString) {
        case 'close':
            // return Object.assign({}, defaultFilters, {close: true});
            return { type: GET_CLOSE }
        case 'favourites':
            return { type: GET_FAVOURITES }
            // return Object.assign({}, defaultFilters, {favourites: true});
        case undefined:
            return {
                    type: NEW_FILTERS,
                    payload: Object.assign({}, defaultFilters)
                };
        case null:
            return {
                    type: NEW_FILTERS,
                    payload: Object.assign({}, defaultFilters)
                };
        default:
            const parsedString = urlString.split('_')
                    .map(parser)
                    .reduce( flattener, Object.assign({}, defaultFilters) )
            return {
                    type: NEW_FILTERS,
                    payload: parsedString
                };
            // return urlString.split('_')
            //         .map(parser)
            //         .reduce( flattener, Object.assign({}, defaultFilters) );
    }
}

function flattener(acc, v) {
    let k = Object.keys(v)[0];
    if (k === 'price' && acc.price) {
        return Object.assign(acc, {price: acc.price.push(v.price[0])})
    } else {
        return Object.assign(acc, v)
    }
}

function parser(s: string): Object {
    let parsers = [locationParser, cuisineParser, priceParser, searchParser];
    return parsers
        .map(fn => fn(s))
        .filter(item => Object.keys(item).length > 0)[0]
}

function locationParser(s: string): Object {
    return (Dictionary.areas[s]) ? {location: s} : {};
}

function cuisineParser(s: string): Object {
    return (Dictionary.cuisines[s]) ? {cuisine: s} : {};
}

function priceParser(s: string): Object {
    let priceKeys = Dictionary.prices.map(p => p.key);
    let priceAsInt = priceKeys.indexOf(s)
    if (priceAsInt > -1) {
        let obj = {};
        obj[s] = true;
        return obj;
    } else {
        return {};
    }
}

function searchParser(s: string): Object {
    return {'search': s};
}
