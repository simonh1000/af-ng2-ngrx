import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor() { }

  persist(key, val) {
    return localStorage.setItem(key, JSON.stringify(val));
  }

  getCache() {
    let cache = localStorage.getItem('favourites') || "[]";
    return JSON.parse(cache);
  }

  setCache(fs) {
    return this.persist('favourites', fs);
  }

  getNotices() {
    let cache = localStorage.getItem('notices') || "{}";
    return JSON.parse(cache);    
  }
}
