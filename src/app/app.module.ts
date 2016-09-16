import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Store, StoreModule } from '@ngrx/store';
// import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import { restosReducer } from './reducers/restos_reducer';
import { filtersReducer, initFilters } from './reducers/filters_reducer';
import { AppComponent } from './app.component';
import { GetDataService } from './services/get-data.service';
import { ListComponent } from './list/list.component';
import { FiltersComponent } from './filters/filters.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    FiltersComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.provideStore({ 
      restos: restosReducer,
      filters : filtersReducer
    }, { 
      restos: [],
      filters: initFilters
    }),
    FormsModule,
    HttpModule
  ],
  providers: [ GetDataService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
