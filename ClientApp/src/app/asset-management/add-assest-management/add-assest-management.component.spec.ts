import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssestManagementComponent } from './add-assest-management.component';

describe('AddAssestManagementComponent', () => {
  let component: AddAssestManagementComponent;
  let fixture: ComponentFixture<AddAssestManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAssestManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
