import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrpoDetailsComponent } from './prpo-details.component';

describe('PrpoDetailsComponent', () => {
  let component: PrpoDetailsComponent;
  let fixture: ComponentFixture<PrpoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrpoDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrpoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
