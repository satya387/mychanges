import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePurchaseRequestComponent } from './approve-purchase-request.component';

describe('RejectPurchaseRequestComponent', () => {
  let component: ApprovePurchaseRequestComponent;
  let fixture: ComponentFixture<ApprovePurchaseRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovePurchaseRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovePurchaseRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
