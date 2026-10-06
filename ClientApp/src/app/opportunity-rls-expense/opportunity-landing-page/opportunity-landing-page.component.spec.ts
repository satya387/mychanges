import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityLandingPageComponent } from './opportunity-landing-page.component';

describe('OpportunityLandingPageComponent', () => {
  let component: OpportunityLandingPageComponent;
  let fixture: ComponentFixture<OpportunityLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpportunityLandingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
