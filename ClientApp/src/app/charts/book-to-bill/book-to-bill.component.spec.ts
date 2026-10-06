import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookToBillComponent } from './book-to-bill.component';

describe('BookToBillComponent', () => {
  let component: BookToBillComponent;
  let fixture: ComponentFixture<BookToBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookToBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookToBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
