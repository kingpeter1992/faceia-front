import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistanceCulte } from './assistance-culte';

describe('AssistanceCulte', () => {
  let component: AssistanceCulte;
  let fixture: ComponentFixture<AssistanceCulte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistanceCulte],
    }).compileComponents();

    fixture = TestBed.createComponent(AssistanceCulte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
