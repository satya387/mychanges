import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectpoComponent } from './rejectpo.component';

describe('RejectpoComponent', () => {
  let component: RejectpoComponent;
  let fixture: ComponentFixture<RejectpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectpoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
