import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultSectionComponent } from './default-section.component';

describe('DefaultSectionComponent', () => {
  let component: DefaultSectionComponent;
  let fixture: ComponentFixture<DefaultSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
