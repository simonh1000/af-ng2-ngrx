import { Injectable } from '@angular/core';

import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

// import { Observable } from 'rxjs';
// import { RESTOS } from '../../../ignore/mock-restos';

@Injectable()
export class GetDataService {

  constructor(private http: Http) { }

  getData() {
    console.log('Downloading data from', environment.dataServer);
    return this.http.get(environment.dataServer)
      .map(res => res.json());

    // return Observable.create(observer => {
    //   let mapped_restos = RESTOS.map(r => Object.assign(r, {open: false}));
    //   observer.next(mapped_restos);
    // });
  }

}
