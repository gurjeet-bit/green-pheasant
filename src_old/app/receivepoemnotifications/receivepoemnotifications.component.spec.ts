import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivepoemnotificationsComponent } from './receivepoemnotifications.component';

describe('ReceivepoemnotificationsComponent', () => {
  let component: ReceivepoemnotificationsComponent;
  let fixture: ComponentFixture<ReceivepoemnotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivepoemnotificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivepoemnotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
