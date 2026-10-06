import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerValueAddComponent } from './customer-value-add.component';

describe('CustomerValueAddComponent', () => {
  let component: CustomerValueAddComponent;
  let fixture: ComponentFixture<CustomerValueAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerValueAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerValueAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
