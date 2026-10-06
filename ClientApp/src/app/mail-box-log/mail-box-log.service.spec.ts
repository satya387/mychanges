import { TestBed } from '@angular/core/testing';

import { MailBoxLogService } from './mail-box-log.service';

describe('MailBoxLogService', () => {
  let service: MailBoxLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MailBoxLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
