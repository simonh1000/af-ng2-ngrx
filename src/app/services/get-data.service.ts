import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { RESTOS } from './mock-restos';

@Injectable()
export class GetDataService {

  // constructor(public store: Store<Resto[]>) {
  constructor() {
    // console.log("GetDataService.constructor");
  }

  getData() {
    return Observable.create(observer => {
      let mapped_restos = RESTOS.map(r => Object.assign(r, {open: false}));
      observer.next(mapped_restos);
    });
  }

}
