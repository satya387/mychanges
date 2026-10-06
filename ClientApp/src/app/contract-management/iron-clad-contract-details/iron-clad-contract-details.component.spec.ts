import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IronCladContractDetailsComponent } from './iron-clad-contract-details.component';

describe('IronCladContractDetailsComponent', () => {
  let component: IronCladContractDetailsComponent;
  let fixture: ComponentFixture<IronCladContractDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IronCladContractDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IronCladContractDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
