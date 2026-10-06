import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensePopupComponent } from './expense-popup.component';

describe('ExpensePopupComponent', () => {
  let component: ExpensePopupComponent;
  let fixture: ComponentFixture<ExpensePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpensePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
