import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralPoliciesComponent } from './referral-policies.component';

describe('ReferralPoliciesComponent', () => {
  let component: ReferralPoliciesComponent;
  let fixture: ComponentFixture<ReferralPoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralPoliciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
