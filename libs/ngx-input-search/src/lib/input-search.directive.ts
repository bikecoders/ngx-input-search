import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { fromEvent, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';

@Directive({
  selector: '[ngxInputSearch]',
})
export class InputSearchDirective implements OnDestroy, OnInit {
  private readonly debounceTimeDefault = 400;
  private readonly minStringLengthDefault = 0;

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
    this._debounceTime = dbTime ? dbTime : this.debounceTimeDefault;
  }
  get debounceTime() {
    return this._debounceTime;
  }
  private _debounceTime;

  /**
   * Indicates the minimum length that must have the string to be emitted.
   * By default is 0
   */
  @Input()
  set stringLength(stLength: number) {
    this._stringLength =
      stLength && stLength >= 0 ? stLength : this.minStringLengthDefault;
  }
  get stringLength() {
    return this._stringLength;
  }
  private _stringLength;

  /**
   * Indicates when the string written length is shorter than the minimum
   * defined by the property `stringLength`
   */
  @Output() stringTooShort: EventEmitter<string>;

  /**
   * Indicates when the input is empty
   */
  @Output() emptyInput: EventEmitter<void>;

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
    // Set defaults
    this.debounceTime = this.debounceTimeDefault;
    this.stringLength = this.minStringLengthDefault;

    this.ngxInputSearch = new EventEmitter<Event>();
    this.stringTooShort = new EventEmitter<string>();
    this.emptyInput = new EventEmitter<void>();

    this.inputEl = this.el.nativeElement;
  }

  ngOnInit() {
    // Subscribe to the input event
    this.inputEventSubs = fromEvent(this.inputEl, 'input')
      .pipe(
        // Wait until the user stops writing
        debounceTime(this.debounceTime),
        // Transform the event to track the input value, to use it in the comparison
        map(event => ({
          value: (event.target as HTMLInputElement).value.trim(),
          event,
        })),
        // Avoid emitting of the input value is the same
        distinctUntilChanged((prev, next) => prev.value === next.value),
        // Validate the minimum length that must have the string
        filter(tmpObj => {
          if (tmpObj.value.length === 0) {
            // emit that the input is empty
            this.emptyInput.emit();
            return false;
          }
          if (tmpObj.value.length < this.stringLength) {
            // emit that the string length is too short
            this.stringTooShort.emit(tmpObj.value);
            return false;
          } else {
            return true;
          }
        }),
        // Return only the input event
        map(tmpObj => tmpObj.event),
      )
      .subscribe($event => this.ngxInputSearch.next($event));
  }

  ngOnDestroy() {
    this.inputEventSubs.unsubscribe();
  }
}
