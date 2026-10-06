import { TestBed } from '@angular/core/testing';

import { OpportunityGuard } from './opportunity.guard';

describe('OpportunityGuard', () => {
  let guard: OpportunityGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OpportunityGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
