import { Component, OnInit, Input } from '@angular/core';

import { Country } from '../shared/countries.model';

@Component({
  selector: 'demo-country-card',
  templateUrl: './country-card.component.html'
})
export class CountryCardComponent implements OnInit {
  @Input() public country: Country;

  constructor() {}

  ngOnInit() {}
}
