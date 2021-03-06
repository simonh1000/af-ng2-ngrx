import { Filters } from '../reducers/filters';

export function toUrl(filters: Filters): string {
    if (filters.close) {
        return 'close';
    } else if (filters.favourites) {
        return 'favourites';
    } else {
        let encoders = [search, cuisine, location, price];
        return flatten(encoders.map(fn => fn(filters)))
            .join('_');
    }
}

function flatten(arr: any[][]): any[] {
    return arr.reduce(
        (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
    );
}

function search(filters: Filters): string[] {
    if (filters.search === '') {
        return [];
    } else { return [filters.search]; }
}

function location(filters: Filters): string[] {
    return (filters.location === 'amsterdam') ? [] : [filters.location];
}

function cuisine(filters: Filters): string[] {
    return (filters.cuisine === 'all cuisines') ? [] : [filters.cuisine];
}

function price(filters: Filters): string[] {
    let priceElems = ['budget', 'midrange', 'finedining']
    return priceElems.filter(e => filters[e]);
}

