

# ngx-input-search [![npm version](https://badge.fury.io/js/ngx-input-search.svg)](https://badge.fury.io/js/ngx-input-search)

## TL;DR:

Angular directive to put in your search inputs.
With its only output you will be able to get what the user writes with all good practices related to search inputs

```html
<input type="text" (ngxInputSearch)="doTheSearch($event)"/>
```


### How to use it
`dummy.component.ts`
```ts
@Component({
  selector: 'dummy-component',
  templateUrl: 'dummy.component.html',
})
class DummyComponent {

  doTheSearch($event: Event) {
    const stringEmitted = ($event.target as HTMLInputElement).value;
    console.log(stringEmitted);
  }
}
```


`dummy.component.html`
```html
<label for="search-box"> Search Input </label>
<input id="search-box" type="text" (ngxInputSearch)="doTheSearch($event)"/>

<br>

<span> The search box triggers -> {{ stringEmitted }} </span>
```

## Demo
- online demo: https://bikecoders.github.io/ngx-input-search/
- [demo-app](https://github.com/bikecoders/ngx-input-search/tree/master/src): Source code available


## Getting started

1. Install `ngx-input-search`:

```bash
# using npm
npm install ngx-input-search --save

# using yarn <3
yarn add ngx-input-search
```

2. Import the installed library:

```ts
import { InputSearchModule } from 'ngx-input-search';

@NgModule({
  ...
  imports: [
    ...
    InputSearchModule
  ]
})
export class AppModule { }
```

3. Use it in your component

```ts
@Component({
  selector: 'dummy-component',
  template: `
    <input type="text" (ngxInputSearch)="doTheSearch($event)"/>
  `,
})
class DummyComponent {
  doTheSearch($event: Event) {
    const stringEmitted = ($event.target as HTMLInputElement).value;
    // Your request...
  }
}
```

## Properties

| Name  | Description |
| :---- | :---------- |
| `@Output() ngxInputSearch: EventEmitted<Event>` | Event emitted when the user has entered the search criteria in the input element |
| `@Input() debounceTime: number = 400` | Indicates how much time in ms it will wait for the users stops typing. By default is 400ms |


## Why?

When we want to implement a search input we usually want to wait until the user stops writing to make the request and also check if the search criteria is different than the last one to avoid making the same request right away.

With this directive we have the desired behavior.
