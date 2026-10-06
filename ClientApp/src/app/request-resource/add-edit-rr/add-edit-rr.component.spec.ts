import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRrComponent } from './add-edit-rr.component';

describe('AddEditRrComponent', () => {
  let component: AddEditRrComponent;
  let fixture: ComponentFixture<AddEditRrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditRrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
