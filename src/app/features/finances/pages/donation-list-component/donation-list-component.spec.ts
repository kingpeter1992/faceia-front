import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationListComponent } from './donation-list-component';

describe('DonationListComponent', () => {
  let component: DonationListComponent;
  let fixture: ComponentFixture<DonationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DonationListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
