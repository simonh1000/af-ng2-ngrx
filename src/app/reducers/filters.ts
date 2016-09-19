export interface Point {
    lat: number;
    lng: number;
}

export interface Filters {
    search: string;
    location: string;
    cuisine: string;
    budget: boolean;
    midrange: boolean;
    finedining: boolean;
    geo: Point;
}
