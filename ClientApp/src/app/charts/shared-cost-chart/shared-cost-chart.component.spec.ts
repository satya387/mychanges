import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCostChartComponent } from './shared-cost-chart.component';

describe('SharedCostChartComponent', () => {
  let component: SharedCostChartComponent;
  let fixture: ComponentFixture<SharedCostChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedCostChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedCostChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
