import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDefaultSectionComponent } from './add-default-section.component';

describe('AddDefaultSectionComponent', () => {
  let component: AddDefaultSectionComponent;
  let fixture: ComponentFixture<AddDefaultSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDefaultSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDefaultSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
