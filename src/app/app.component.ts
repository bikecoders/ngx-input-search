import { Component } from '@angular/core';

import { Observable, NEVER } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CountriesService } from './countries/countries.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  empty = false;

  countryFilterTooShort = false;

  constructor(
    private countriesService: CountriesService
  ) { }

  countriesResult: Observable<Country[]>;

  doTheSearch($event: Event) {
    this.empty = false;
    this.countryFilterTooShort = false;

    const query = ($event.target as HTMLInputElement).value;

    this.countriesResult =
      this.countriesService.getCountriesByName(query).pipe(
        catchError(err => {
          this.empty = err.status === 404;
          return NEVER;
        })
      );
  }
}
