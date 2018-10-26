import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CountryCardComponent } from './countries/country-card/country-card.component';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { InputSearchModule } from 'ngx-input-search';

@NgModule({
  declarations: [
    AppComponent,
    CountryCardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    InputSearchModule,
    LoadingBarHttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
