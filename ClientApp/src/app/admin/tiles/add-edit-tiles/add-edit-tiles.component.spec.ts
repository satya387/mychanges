import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTilesComponent } from './add-edit-tiles.component';

describe('AddEditTilesComponent', () => {
  let component: AddEditTilesComponent;
  let fixture: ComponentFixture<AddEditTilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditTilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
