import { TestBed } from '@angular/core/testing';

import { InputSearchService } from './input-search.service';

describe('InputSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InputSearchService = TestBed.get(InputSearchService);
    expect(service).toBeTruthy();
  });
});
