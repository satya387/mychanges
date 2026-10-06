import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgaDataTableComponent } from './sga-data-table.component';

describe('SgaFirstTableComponent', () => {
  let component: SgaDataTableComponent;
  let fixture: ComponentFixture<SgaDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgaDataTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SgaDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
