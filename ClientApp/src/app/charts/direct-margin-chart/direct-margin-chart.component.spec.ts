import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginChartComponent } from './direct-margin-chart.component';

describe('MarginChartComponent', () => {
  let component: MarginChartComponent;
  let fixture: ComponentFixture<MarginChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarginChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarginChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
