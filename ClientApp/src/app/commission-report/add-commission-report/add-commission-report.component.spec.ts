import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommissionReportComponent } from './add-commission-report.component';

describe('AddCommissionReportComponent', () => {
  let component: AddCommissionReportComponent;
  let fixture: ComponentFixture<AddCommissionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCommissionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommissionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
