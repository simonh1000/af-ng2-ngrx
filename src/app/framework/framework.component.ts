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
import { toUrl } from '../filters/encoder';

@Component({
  selector: 'app-framework',
  templateUrl: './framework.component.html',
  styleUrls: ['./framework.component.css'],
  providers: [ GetDataService ]
})
export class FrameworkComponent implements OnInit {

  restos_list: Observable<Resto[]>;  // this will be the filtered list
  filters: Observable<Filters>;
  rotm: Observable<Resto>;
  rotms: Observable<Resto[]>;
  selectedResto: Observable<Resto>;
  top5: Observable<boolean>;
  not_top5: Observable<boolean>;

  constructor(public store:Store<AppState>, private data:GetDataService) {
    this.restos_list = this.store.select(state => state.restos);
    this.filters = this.store.select(state => state.filters);
    this.selectedResto = this.store.select(state => state.selectedResto[0])
    this.top5 = this.store.select(state => state.filters).map(v => toUrl(v) === "");
    this.not_top5 = this.store.select(state => state.filters).map(v => toUrl(v) !== "");
    this.rotm = this.store.select(state => state.restos[0]);
    this.rotms = this.store.select(state => state.restos.slice(1));
  }

  ngOnInit(): void {
    this.data.getData()
    .subscribe( data => {
        console.log("Data returned");
        this.store.dispatch({
          type: DATA,
          payload: data
        })
      });
  }

  goDam() {
    this.quickLink({location: 'dam'});
  }

  quickLink(obj) {
      let filters = Object.assign({}, initFilters, obj);

      this.store.dispatch({
        type: NEW_FILTERS,
        payload: filters
      })
  }
}
