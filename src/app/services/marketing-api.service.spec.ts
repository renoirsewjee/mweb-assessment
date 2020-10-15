import { TestBed } from '@angular/core/testing';

import { MarketingApiService } from './marketing-api.service';

describe('MarketingApiService', () => {
  let service: MarketingApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketingApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
