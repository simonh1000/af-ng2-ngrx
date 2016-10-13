import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
// import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import { WindowRef } from './services/window.ref';
import { ScrollOnClickDirective } from './scroll-on-click.directive';

import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { FiltersComponent } from './filters/filters.component';
import { MapComponent } from './map/map.component';
import { RestoComponent } from './resto/resto.component';

import { restosReducer } from './reducers/restos_reducer';
import { mapReducer } from './reducers/map_reducer';
import { selectedReducer } from './reducers/selected_reducer';
import { filtersReducer } from './reducers/filters_reducer';
import { geoReducer } from './reducers/geo_reducer';

import { GetDataService } from './services/get-data.service';
import { GeoService } from './services/geo.service';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    FiltersComponent,
    RestoComponent,
    MapComponent,
    ScrollOnClickDirective
  ],
  imports: [
    BrowserModule,
    StoreModule.provideStore({
      restos: restosReducer,
      filters : filtersReducer,
      selectedResto: selectedReducer,
      mapReady: mapReducer,
      myLocation: geoReducer
    }),
    FormsModule,
    HttpModule,
  ],
  providers: [
    GetDataService,
    GeoService,
    WindowRef
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
