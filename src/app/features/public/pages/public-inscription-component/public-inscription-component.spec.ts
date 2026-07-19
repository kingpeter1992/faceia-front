import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicInscriptionComponent } from './public-inscription-component';

describe('PublicInscriptionComponent', () => {
  let component: PublicInscriptionComponent;
  let fixture: ComponentFixture<PublicInscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicInscriptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicInscriptionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
