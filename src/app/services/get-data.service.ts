import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { RESTOS } from './mock-restos';

@Injectable()
export class GetDataService {

  constructor() {
  }

  getData() {
    return Observable.create(observer => {
      let mapped_restos = RESTOS.map(r => Object.assign(r, {open: false}));
      observer.next(mapped_restos);
    });
  }

}
