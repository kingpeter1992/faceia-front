import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouveauComposant } from './nouveau-composant';

describe('NouveauComposant', () => {
  let component: NouveauComposant;
  let fixture: ComponentFixture<NouveauComposant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NouveauComposant],
    }).compileComponents();

    fixture = TestBed.createComponent(NouveauComposant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
