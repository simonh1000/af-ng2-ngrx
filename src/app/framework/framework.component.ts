import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';

import { Resto } from '../reducers/resto';
import { AppState } from '../reducers/state';
import { GetDataService } from '../services/get-data.service';
import { DATA } from '../reducers/restos_reducer';
import { initFilters, NEW_FILTERS } from '../reducers/filters_reducer';
import { ListComponent } from '../list/list.component';
import { Filters } from '../reducers/filters';

@Component({
  selector: 'app-framework',
  templateUrl: './framework.component.html',
  styleUrls: ['./framework.component.css'],
  providers: [ GetDataService ]
})
export class FrameworkComponent implements OnInit {

  title : String;
  restos_list : Observable<Resto[]>;  // this will be the filtered list
  filters: Observable<Filters>;  // this will be the filtered list

  constructor(public store:Store<AppState>, private data:GetDataService) {
    this.title = 'app works!';

    this.restos_list = this.store.map(state => {
      console.log("applying filter");
      return state.restos.slice(0, state.filters.count);
    });

    this.filters = this.store.select(state => state.filters);
  }

  ngOnInit(): void {
    this.data.getData()
    .subscribe(
        data => {
          console.log("Data returned");
          this.store.dispatch({type: DATA, payload: data})
        });
  }

  goDam() {
    console.log(initFilters);
    let filters = Object.assign(initFilters, {location: 'dam'});
    console.log(filters);

    this.store.dispatch({
      type: NEW_FILTERS, 
      payload: filters 
    })
  }
}
