import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertModuleComponent } from './alert-module.component';

describe('AlertModuleComponent', () => {
  let component: AlertModuleComponent;
  let fixture: ComponentFixture<AlertModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
