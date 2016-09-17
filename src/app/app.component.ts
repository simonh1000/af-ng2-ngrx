import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // title : String;
  // restos_list : Observable<Resto[]>;  // this will be the filtered list
  // filters: Observable<Filters>;  // this will be the filtered list

  constructor() {}
  // public store:Store<AppState>, private data:GetDataService) {
  //   this.title = 'app works!';

  //   this.restos_list = this.store.map(state => {
  //     console.log("applying filter");
  //     return state.restos.slice(0, state.filters.count);
  //   });

  //   this.filters = this.store.select(state => state.filters);
  // }

  // ngOnInit(): void {
  //   this.data.getData()
  //   .subscribe(
  //       data => {
  //         console.log("Data returned");
  //         this.store.dispatch({type: DATA, payload: data})
  //       });
  // }
}
