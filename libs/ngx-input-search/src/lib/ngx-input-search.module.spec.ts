import { async, TestBed } from '@angular/core/testing';
import { NgxInputSearchModule } from './ngx-input-search.module';

describe('NgxInputSearchModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxInputSearchModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgxInputSearchModule).toBeDefined();
  });
});
