import { TestBed } from '@angular/core/testing';

import { AlertModuleService } from './alert-module.service';

describe('AlertModuleService', () => {
  let service: AlertModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
