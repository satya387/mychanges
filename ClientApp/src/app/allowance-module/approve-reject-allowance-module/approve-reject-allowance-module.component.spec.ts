import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRejectAllowanceModuleComponent } from './approve-reject-allowance-module.component';

describe('ApproveRejectOpportunityModalComponent', () => {
  let component: ApproveRejectAllowanceModuleComponent;
  let fixture: ComponentFixture<ApproveRejectAllowanceModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveRejectAllowanceModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveRejectAllowanceModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
