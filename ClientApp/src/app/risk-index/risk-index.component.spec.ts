import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskIndexComponent } from './risk-index.component';


describe('RiskIndexComponent', () => {
  let component: RiskIndexComponent;
  let fixture: ComponentFixture<RiskIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});





