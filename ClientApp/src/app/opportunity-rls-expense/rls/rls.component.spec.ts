import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RlsComponent } from './rls.component';

describe('RlsComponent', () => {
  let component: RlsComponent;
  let fixture: ComponentFixture<RlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
