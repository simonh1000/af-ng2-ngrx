import { Injectable } from '@angular/core';

import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

import { Observable } from 'rxjs';
// import { RESTOS } from '../../../ignore/mock-restos';

@Injectable()
export class GetDataService {

  constructor(private http: Http) { }

  getData(): Observable<any> {
    console.log('Downloading data from', environment.dataServer);
    return this.http.get(environment.dataServer)
      .map(this.extractData);

    // return Observable.create(observer => {
    //   let mapped_restos = RESTOS.map(r => Object.assign(r, {open: false}));
    //   observer.next(mapped_restos);
    // });
  }
  private extractData(res: Response) {
      let body = res.json();
      return body || { };
    }

}
