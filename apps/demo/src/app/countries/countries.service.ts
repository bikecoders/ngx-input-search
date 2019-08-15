import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Country } from './shared/countries.model';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private readonly apiUrl = 'https://restcountries.eu/rest/v2';

  constructor(private http: HttpClient) {}

  getCountriesByName(lang: string): Observable<Country[]> {
    const url = `${this.apiUrl}/name/${lang}`;

    return this.http.get<Country[]>(url);
  }
}
