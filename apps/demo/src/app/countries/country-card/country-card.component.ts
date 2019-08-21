import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Country } from '../shared/countries.model';

@Component({
  selector: 'demo-country-card',
  templateUrl: './country-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryCardComponent {
  @Input() public country: Country;
}
