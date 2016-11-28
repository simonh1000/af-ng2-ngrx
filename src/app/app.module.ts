import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { StoreModule } from '@ngrx/store';

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

import { WindowRef } from './services/window.ref';
import { GetDataService } from './services/get-data.service';
import { GeoService } from './services/geo.service';
import { StorageService } from './services/storage.service';

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
      selectedQName: selectedReducer,
      mapReady: mapReducer,
      myLocation: geoReducer,
    }),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
  ],
  providers: [
    GetDataService,
    GeoService,
    WindowRef,
    StorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
