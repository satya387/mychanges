import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRrMobileComponent } from './add-edit-rr-mobile.component';

describe('AddEditRrMobileComponent', () => {
  let component: AddEditRrMobileComponent;
  let fixture: ComponentFixture<AddEditRrMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRrMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditRrMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
