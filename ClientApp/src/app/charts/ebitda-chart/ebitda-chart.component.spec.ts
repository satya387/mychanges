import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbitdaChartComponent } from './ebitda-chart.component';

describe('EbitdaChartComponent', () => {
  let component: EbitdaChartComponent;
  let fixture: ComponentFixture<EbitdaChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EbitdaChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EbitdaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
