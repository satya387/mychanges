import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllTilesComponent } from './view-all-tiles.component';

describe('ViewAllTilesComponent', () => {
  let component: ViewAllTilesComponent;
  let fixture: ComponentFixture<ViewAllTilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllTilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
