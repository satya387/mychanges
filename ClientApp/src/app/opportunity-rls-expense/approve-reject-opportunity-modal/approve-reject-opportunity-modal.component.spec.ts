import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRejectOpportunityModalComponent } from './approve-reject-opportunity-modal.component';

describe('ApproveRejectOpportunityModalComponent', () => {
  let component: ApproveRejectOpportunityModalComponent;
  let fixture: ComponentFixture<ApproveRejectOpportunityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveRejectOpportunityModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveRejectOpportunityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
