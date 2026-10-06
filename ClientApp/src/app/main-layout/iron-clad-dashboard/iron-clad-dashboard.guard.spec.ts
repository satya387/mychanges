import { TestBed } from '@angular/core/testing';

import { IronCladDashboardGuard } from './iron-clad-dashboard.guard';

describe('IronCladDashboardGuard', () => {
  let guard: IronCladDashboardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IronCladDashboardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
