import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Store, StoreModule } from '@ngrx/store';
import { Resto } from './reducers/resto';
import { AppState } from './reducers/state';
import { GetDataService } from './services/get-data.service';
import { DATA } from './reducers/restos_reducer';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ GetDataService ]
})
export class AppComponent implements OnInit {
  title : String;
  restos_list : Observable<Resto[]>;  // this will be the filtered list

  constructor(public store:Store<AppState>, private data:GetDataService) {
    this.title = 'app works!';

    this.restos_list = this.store.map(state => {
      console.log(state);
      return state.restos.slice(0, state.filters.count);
    });
  }

  ngOnInit(): void {
    this.data.getData()
    .subscribe(
        data => {
          console.log("Data returned");
          this.store.dispatch({type: DATA, payload: data})
        });
  }
}
