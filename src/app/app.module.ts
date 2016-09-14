import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Store, StoreModule } from '@ngrx/store';
import { DATA, restosReducer } from './reducers/restos_reducer';
import { AppComponent } from './app.component';
import { GetDataService } from './get-data.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.provideStore({ restos: restosReducer }, { restos: [] }),
    FormsModule,
    HttpModule
  ],
  providers: [ GetDataService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
