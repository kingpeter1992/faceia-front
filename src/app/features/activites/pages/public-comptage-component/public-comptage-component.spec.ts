import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicComptageComponent } from './public-comptage-component';

describe('PublicComptageComponent', () => {
  let component: PublicComptageComponent;
  let fixture: ComponentFixture<PublicComptageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicComptageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicComptageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
