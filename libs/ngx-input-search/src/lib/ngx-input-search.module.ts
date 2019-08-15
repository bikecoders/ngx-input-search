import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputSearchDirective } from './input-search.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [InputSearchDirective],
  exports: [InputSearchDirective]
})
export class NgxInputSearchModule {}
