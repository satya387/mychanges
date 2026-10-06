import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertFilterComponent } from './alert-filter.component';

describe('AlertFilterComponent', () => {
  let component: AlertFilterComponent;
  let fixture: ComponentFixture<AlertFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
