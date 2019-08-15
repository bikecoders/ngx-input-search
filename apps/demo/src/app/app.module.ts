import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { CountryCardComponent } from './countries/country-card/country-card.component';
import { NgxInputSearchModule } from '@ngx-input-search/ngx-input-search';

@NgModule({
  declarations: [AppComponent, CountryCardComponent],
  imports: [BrowserModule, LoadingBarHttpClientModule, NgxInputSearchModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
