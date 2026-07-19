import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewQrDialog } from './new-qr-dialog';

describe('NewQrDialog', () => {
  let component: NewQrDialog;
  let fixture: ComponentFixture<NewQrDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewQrDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(NewQrDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
