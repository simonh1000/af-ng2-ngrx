import { Injectable } from '@angular/core';

import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

// import { Observable } from 'rxjs';
// import { RESTOS } from './mock-restos';

@Injectable()
export class GetDataService {

  constructor(private http: Http) { }

  getData() {
    // return this.http.get('http://localhost/restos-af2015.json')
    // return this.http.get('https://www.amsterdamfoodie.nl/restos-af2015.json')
    return this.http.get(environment.dataServer)
      .map(res => res.json());

    // return Observable.create(observer => {
    //   let mapped_restos = RESTOS.map(r => Object.assign(r, {open: false}));
    //   observer.next(mapped_restos);
    // });
  }

}
