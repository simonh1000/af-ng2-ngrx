
import { Filters } from '../reducers/filters';
import { initFilters } from '../reducers/filters_reducer';
import { Dictionary } from './dictionary';

export function fromUrl(urlString: string): Filters {
    console.log('fromUrl', urlString);
    switch(urlString) {
        case "close": 
            return Object.assign({}, initFilters, {close: true});
        case undefined:
            return Object.assign({}, initFilters);
        case null:
            return Object.assign({}, initFilters);
        default:
            return urlString.split('_')
                    .map(parser)
                    .reduce( flattener, Object.assign({}, initFilters) );
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
    if (Dictionary.areas[s]) {
        return {location: s};
    } else {
        return {};
    }
}
function cuisineParser(s: string): Object {
    if (Dictionary.cuisines[s]) {
        return {cuisine: s};
    } else {
        return {};
    }
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