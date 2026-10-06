import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRiskComponent } from './account-risk.component';

describe('AccountRiskComponent', () => {
  let component: AccountRiskComponent;
  let fixture: ComponentFixture<AccountRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountRiskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
