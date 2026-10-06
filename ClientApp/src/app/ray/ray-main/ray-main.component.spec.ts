import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RayMainComponent } from './ray-main.component';

describe('RayMainComponent', () => {
  let component: RayMainComponent;
  let fixture: ComponentFixture<RayMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RayMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RayMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
