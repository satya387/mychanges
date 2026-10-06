import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IronCladDashboardComponent } from './iron-clad-dashboard.component';

describe('IronCladDashboardComponent', () => {
  let component: IronCladDashboardComponent;
  let fixture: ComponentFixture<IronCladDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IronCladDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IronCladDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
