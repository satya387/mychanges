import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignControlComponent } from './assign-control.component';

describe('AssignControlComponent', () => {
  let component: AssignControlComponent;
  let fixture: ComponentFixture<AssignControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
