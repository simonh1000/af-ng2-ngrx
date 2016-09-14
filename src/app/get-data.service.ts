import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { DATA } from './reducers/restos_reducer';
import { Resto } from './resto';
import { RESTOS } from './mock-restos';

@Injectable()
export class GetDataService {

  constructor(public store: Store<Resto[]>) {
    console.log("GetDataService.constructor");
  }

  getData() {
    return Observable.create(observer => {
      observer.next(RESTOS);
      // observer.completed();
    });
  }

}
