import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectPurchaseRequestComponent } from './reject-purchase-request.component';

describe('RejectPurchaseRequestComponent', () => {
  let component: RejectPurchaseRequestComponent;
  let fixture: ComponentFixture<RejectPurchaseRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectPurchaseRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectPurchaseRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
