import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor() { }

  getCache() {
    // let cache = localStorage.getItem('favourites') || "";
    // return cache.split(",").filter(x => x !== "");
    console.log(localStorage.getItem('favourites'));
    let cache = localStorage.getItem('favourites') || "[]";
    return JSON.parse(cache);
  }

  setCache(fs) {
    return localStorage.setItem('favourites', JSON.stringify(fs));
  }
}
