import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccMarginChartComponent } from './acc-margin-chart.component';

describe('AccMarginChartComponent', () => {
  let component: AccMarginChartComponent;
  let fixture: ComponentFixture<AccMarginChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccMarginChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccMarginChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
