import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Store, StoreModule } from '@ngrx/store';
import { Resto } from './resto';
import { AppState } from './services/state';
import { GetDataService } from './get-data.service';
import { DATA } from './reducers/restos_reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ GetDataService ]
})
export class AppComponent implements OnInit {
  // store: Observable<Resto[]>
  title : String;

  constructor(public store:Store<AppState>, private data:GetDataService) {
    this.title = 'app works!';
    this.store.subscribe(data => {
      console.log(data);
      if (data.restos.length > 0) {
        console.log(data);
        this.title = data.restos[0].name;
      }
    })
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
