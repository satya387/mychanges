import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAllowanceComponent } from './add-allowance.component';

describe('AddAllowanceComponent', () => {
  let component: AddAllowanceComponent;
  let fixture: ComponentFixture<AddAllowanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAllowanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAllowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
