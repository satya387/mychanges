import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetAssignmentDetailsComponent } from './add-asset-assignment-details.component';

describe('AddAssetAssignmentDetailsComponent', () => {
  let component: AddAssetAssignmentDetailsComponent;
  let fixture: ComponentFixture<AddAssetAssignmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAssetAssignmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssetAssignmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
