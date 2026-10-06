import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowanceModuleComponent } from './allowance-module.component';

describe('AllowanceModuleComponent', () => {
  let component: AllowanceModuleComponent;
  let fixture: ComponentFixture<AllowanceModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllowanceModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowanceModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
