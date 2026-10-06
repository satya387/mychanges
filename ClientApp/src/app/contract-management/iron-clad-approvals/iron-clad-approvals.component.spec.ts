import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IronCladApprovalsComponent } from './iron-clad-approvals.component';

describe('IronCladApprovalsComponent', () => {
  let component: IronCladApprovalsComponent;
  let fixture: ComponentFixture<IronCladApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IronCladApprovalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IronCladApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
