import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateqrComponent } from './createqr-component';

describe('CreateqrComponent', () => {
  let component: CreateqrComponent;
  let fixture: ComponentFixture<CreateqrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateqrComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateqrComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
