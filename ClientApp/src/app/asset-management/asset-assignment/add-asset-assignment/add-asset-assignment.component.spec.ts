import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetAssignmentComponent } from './add-asset-assignment.component';


describe('AddAssetAssignmentComponent', () => {
  let component: AddAssetAssignmentComponent;
  let fixture: ComponentFixture<AddAssetAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAssetAssignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssetAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
