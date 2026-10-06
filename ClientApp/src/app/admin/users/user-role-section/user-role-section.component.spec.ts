import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleSectionComponent } from './user-role-section.component';

describe('UserRoleSectionComponent', () => {
  let component: UserRoleSectionComponent;
  let fixture: ComponentFixture<UserRoleSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRoleSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
