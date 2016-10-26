export interface JsonResto {
    rname: string;
    qname: string;
    address: string;
    tel: string;
    website: string;
    area: string;
    cuisine: string;
    price: number;
    comment: string;
    link: string;
    booking?: string;
    sponsored?: boolean;
    rating: number;
    date?: string;
    recommendation: number;
    lat: number;
    lng: number;
}
export interface Resto {
    rname: string;
    qname: string;
    address: string;
    tel: string;
    website: string;
    area: string;
    cuisine: string;
    price: number;
    comment: string;
    link: string;
    booking?: string;
    sponsored?: boolean;
    rating: number;
    date?: string;
    recommendation: number;
    lat: number;
    lng: number;

    open: boolean;
    distance?: number;
    score: number;
    idx?: number;
}
