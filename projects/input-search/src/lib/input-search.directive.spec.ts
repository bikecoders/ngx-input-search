import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';

import { Subscription } from 'rxjs';
import { InputSearchDirective } from './input-search.directive';


@Component({
  selector: 'ngx-dummy-component',
  template: `
    <label for="search-box"> Search Input </label>
    <input
      id="search-box"
      type="text"
      (ngxInputSearch)="doTheSearch($event)"
      [debounceTime]="debounceTime"
      [stringLength]="minStringLength"
    />

    <br>

    <span> The search box triggers -> {{ stringEmitted }} </span>
  `,
})
class DummyComponent {
  stringEmitted: string;

  debounceTime: number;

  minStringLength: number;

  doTheSearch($event: Event) {
    this.stringEmitted = ($event.target as HTMLInputElement).value;
  }
}

describe('InputSearchDirective', () => {
  let fixture: ComponentFixture<DummyComponent>;
  let component: DummyComponent;
  let componentDe: DebugElement;

  let directive: InputSearchDirective;

  const writeOnInput = (text: string, debounceTime = 400) => {
    const inputSearchDe = componentDe.query(By.css('input'));
    const input: HTMLInputElement = inputSearchDe.nativeElement;

    input.value = text;
    const event = new Event('input');
    input.dispatchEvent(event);

    tick(debounceTime);

    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DummyComponent,
        InputSearchDirective
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyComponent);
    component = fixture.componentInstance;
    componentDe = fixture.debugElement;

    const directiveDe = componentDe.query(By.directive(InputSearchDirective));
    directive = directiveDe.injector.get(InputSearchDirective);

    fixture.detectChanges();
  });

  it('should the dummy component be truthy', () => {
    expect(component).toBeTruthy();
  });

  it('should the directive initialized correctly', () => {
    expect(directive).toBeTruthy();
    expect(directive.ngxInputSearch).toBeTruthy();
    expect(directive.debounceTime).toEqual(400);
    expect(directive.stringLength).toEqual(0);
  });

  it('should set a custom debounce time', fakeAsync(() => {
    directive.ngOnDestroy();
    component.debounceTime = 5000;
    fixture.detectChanges();
    directive.ngOnInit();

    expect(directive.debounceTime).toEqual(5000);

    writeOnInput('hi');
    expect(component.stringEmitted).toBeUndefined();
    tick(5000 - 400);
    expect(component.stringEmitted).toEqual('hi');
  }));

  describe('Minimum string length set', () => {
    it('should set stringLength as 0 when negative value passed', () => {
      component.minStringLength = -1;
      fixture.detectChanges();

      expect(directive.stringLength).toEqual(0);
    });

    it('should set a custom minimum string length', fakeAsync(() => {
      component.minStringLength = 5;
      fixture.detectChanges();

      expect(directive.stringLength).toEqual(5);
    }));

    it('should emit the stringTooShort event when the string is lower that the min string length', fakeAsync(() => {
      component.minStringLength = 5;
      fixture.detectChanges();
      const stringTooShortEmitSpy: jasmine.Spy = spyOn(directive.stringTooShort, 'emit');

      writeOnInput('hi');
      expect(component.stringEmitted).toBeUndefined();
      expect(stringTooShortEmitSpy).toHaveBeenCalledWith('hi');

      writeOnInput('hallo');
      expect(component.stringEmitted).toEqual('hallo');
      expect(stringTooShortEmitSpy).toHaveBeenCalledTimes(1);

      writeOnInput('');
      expect(component.stringEmitted).toEqual('');
      expect(stringTooShortEmitSpy).toHaveBeenCalledTimes(1);
    }));
  });

  describe('On write on search box', () => {
    let doTheSearchSpy: jasmine.Spy;

    beforeEach(() => {
      doTheSearchSpy = spyOn(component, 'doTheSearch').and.callThrough();
    });

    it('should dispatch the correct string', fakeAsync(() => {
      writeOnInput('hi');
      expect(component.stringEmitted).toEqual('hi');

      writeOnInput('');
      expect(component.stringEmitted).toEqual('');
    }));

    it('should NOT dispatch the same string', fakeAsync(() => {
      writeOnInput('hi');
      writeOnInput('hi');

      expect(doTheSearchSpy).toHaveBeenCalledTimes(1);
    }));

    it('should discard changes trimming white spaces', fakeAsync(() => {
      writeOnInput('hi');
      writeOnInput('hi       ');

      expect(doTheSearchSpy).toHaveBeenCalledTimes(1);
    }));

    it('should dispatch different values', fakeAsync(() => {
      writeOnInput('hi');
      writeOnInput('hallo');

      expect(doTheSearchSpy).toHaveBeenCalledTimes(2);
    }));
  });

  it('should unsubscribe from input event when is destroyed', () => {
    fixture.destroy();
    const inputEventSubs = (directive as any).inputEventSubs as Subscription;

    expect(inputEventSubs.closed).toBeTruthy();
  });
});
