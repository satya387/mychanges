import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoTermsconditionsComponent } from './po-termsconditions.component';

describe('PoTermsconditionsComponent', () => {
  let component: PoTermsconditionsComponent;
  let fixture: ComponentFixture<PoTermsconditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoTermsconditionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTermsconditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
