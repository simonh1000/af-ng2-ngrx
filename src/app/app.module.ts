import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { StoreModule } from '@ngrx/store';
// import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { FrameworkComponent } from './framework/framework.component';
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
    FrameworkComponent,
    RestoComponent,
    MapComponent
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
    // routing,
    FormsModule,
    HttpModule,
  ],
  providers: [
    GetDataService,
    GeoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
