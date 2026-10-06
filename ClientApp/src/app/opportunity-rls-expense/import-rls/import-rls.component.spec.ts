import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportRlsComponent } from './import-rls.component';

describe('ImportRlsComponent', () => {
  let component: ImportRlsComponent;
  let fixture: ComponentFixture<ImportRlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportRlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportRlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
