import { Directive, Output, EventEmitter, ElementRef, OnDestroy, Input, OnInit } from '@angular/core';

import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';

@Directive({
  selector: '[ngxInputSearch]'
})
export class InputSearchDirective implements OnDestroy, OnInit {
  /**
     * The output to indicate when the user finish to type on the
     * input search
     */
  @Output() ngxInputSearch: EventEmitter<Event>;

  /**
   * Indicates how much time in ms we will wait for the users stops typing.
   * By default is 400ms
   */
  @Input()
  set debounceTime(dbTime: number) {
    this._debounceTime = dbTime ? dbTime : 400;
  }
  get debounceTime() { return this._debounceTime; }
  private _debounceTime = 400;

  /**
   * The native element instance of the input
   */
  private inputEl: HTMLInputElement;

  /**
   * The subscription to the input native event.
   * Useful to unsubscribe when is destroyed to avoid memory leaks
   */
  private inputEventSubs: Subscription;

  constructor(private el: ElementRef) {
    this.ngxInputSearch = new EventEmitter<Event>();

    this.inputEl = this.el.nativeElement;
  }

  ngOnInit() {
    // Subscribe to the input event
    this.inputEventSubs = fromEvent(this.inputEl, 'input').pipe(
      // Wait until the user stops writing
      debounceTime(this.debounceTime),
      // Transform the event to track the input value, to use it in the comparison
      map((event) => ({
        value: (event.target as HTMLInputElement).value.trim(),
        event
      })),
      // Avoid emitting of the input value is the same
      distinctUntilChanged((prev, next) => prev.value === next.value),
      // Return only the input event
      map(tmpObj => tmpObj.event)
    )
      .subscribe(($event) => this.ngxInputSearch.next($event));
  }

  ngOnDestroy() {
    this.inputEventSubs.unsubscribe();
  }

}
