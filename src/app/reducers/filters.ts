
export interface FormFilters {
    search: string;
    location: string;
    cuisine: string;
    budget: boolean;
    midrange: boolean;
    finedining: boolean;
    close: boolean;
    favourites: boolean;
}

export interface Filters extends FormFilters {
    favouritesList: string[]
}
