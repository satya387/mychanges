import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultSectionTileComponent } from './default-section-tile.component';

describe('DefaultSectionTileComponent', () => {
  let component: DefaultSectionTileComponent;
  let fixture: ComponentFixture<DefaultSectionTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultSectionTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultSectionTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
