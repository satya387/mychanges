import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAssignmentDetailsComponent } from './asset-assignment-details.component';

describe('AssetAssignmentDetailsComponent', () => {
  let component: AssetAssignmentDetailsComponent;
  let fixture: ComponentFixture<AssetAssignmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetAssignmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetAssignmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
