import { TestBed } from '@angular/core/testing';

import { AlertModuleGuard } from './alert-module.guard';

describe('AlertModuleGuard', () => {
  let guard: AlertModuleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AlertModuleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
