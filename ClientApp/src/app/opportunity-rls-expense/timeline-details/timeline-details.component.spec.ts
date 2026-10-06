import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineDetailsComponent } from './timeline-details.component';

describe('TimelineDetailsComponent', () => {
  let component: TimelineDetailsComponent;
  let fixture: ComponentFixture<TimelineDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
