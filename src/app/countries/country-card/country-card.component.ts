import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-country-card',
  templateUrl: './country-card.component.html',
})
export class CountryCardComponent implements OnInit {

  @Input() public country: Country;

  constructor() { }

  ngOnInit() {
  }

}
