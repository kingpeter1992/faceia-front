import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecognizeComponent } from './recognize.component';

describe('RecognizeComponent', () => {
  let component: RecognizeComponent;
  let fixture: ComponentFixture<RecognizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecognizeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecognizeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
