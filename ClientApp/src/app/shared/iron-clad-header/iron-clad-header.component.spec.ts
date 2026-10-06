import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IronCladHeaderComponent } from './iron-clad-header.component';

describe('IronCladHeaderComponent', () => {
  let component: IronCladHeaderComponent;
  let fixture: ComponentFixture<IronCladHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IronCladHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IronCladHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
