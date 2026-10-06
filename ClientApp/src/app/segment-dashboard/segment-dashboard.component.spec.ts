import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentDashboardComponent } from './segment-dashboard.component';

describe('SegmentDashboardComponent', () => {
  let component: SegmentDashboardComponent;
  let fixture: ComponentFixture<SegmentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SegmentDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
