import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { RESTOS } from './mock-restos';

@Injectable()
export class GetDataService {

  // constructor(public store: Store<Resto[]>) {
  constructor() {
    console.log("GetDataService.constructor");
  }

  getData() {
    return Observable.create(observer => {
      observer.next(RESTOS);
    });
  }

}
