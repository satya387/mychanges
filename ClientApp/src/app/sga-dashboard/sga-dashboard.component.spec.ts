import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgaDashboardComponent } from './sga-dashboard.component';

describe('SgaDashboardComponent', () => {
  let component: SgaDashboardComponent;
  let fixture: ComponentFixture<SgaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgaDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SgaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
