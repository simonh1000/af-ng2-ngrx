import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor() { }

  getCache() {
    let cache = localStorage.getItem('favourites') || "[]";
    // console.log(cache);
    return JSON.parse(cache);
  }

  setCache(fs) {
    return localStorage.setItem('favourites', JSON.stringify(fs));
  }
}
