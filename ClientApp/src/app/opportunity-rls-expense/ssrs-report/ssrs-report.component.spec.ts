import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsrsReportComponent } from './ssrs-report.component';

describe('SsrsReportComponent', () => {
  let component: SsrsReportComponent;
  let fixture: ComponentFixture<SsrsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SsrsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SsrsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
