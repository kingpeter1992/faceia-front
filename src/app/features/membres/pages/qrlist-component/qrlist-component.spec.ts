import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrlistComponent } from './qrlist-component';

describe('QrlistComponent', () => {
  let component: QrlistComponent;
  let fixture: ComponentFixture<QrlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrlistComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QrlistComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
