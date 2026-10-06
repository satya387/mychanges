import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpprtunityRlsExpenseComponent } from './opprtunity-rls-expense.component';

describe('OpprtunityRlsExpenseComponent', () => {
  let component: OpprtunityRlsExpenseComponent;
  let fixture: ComponentFixture<OpprtunityRlsExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpprtunityRlsExpenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpprtunityRlsExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
