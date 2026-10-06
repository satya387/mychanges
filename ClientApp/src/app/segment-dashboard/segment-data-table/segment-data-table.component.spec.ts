import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentDataTableComponent } from './segment-data-table.component';

describe('SegmentFirstTableComponent', () => {
  let component: SegmentDataTableComponent;
  let fixture: ComponentFixture<SegmentDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SegmentDataTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
