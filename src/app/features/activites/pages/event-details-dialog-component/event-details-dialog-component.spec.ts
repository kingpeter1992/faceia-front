import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsDialogComponent } from './event-details-dialog-component';

describe('EventDetailsDialogComponent', () => {
  let component: EventDetailsDialogComponent;
  let fixture: ComponentFixture<EventDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
