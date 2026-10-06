import { TestBed } from '@angular/core/testing';

import { RiskIndexService } from './risk-index.service';

describe('RiskIndexService', () => {
  let service: RiskIndexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskIndexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
