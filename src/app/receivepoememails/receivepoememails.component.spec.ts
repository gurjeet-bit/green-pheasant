import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivepoememailsComponent } from './receivepoememails.component';

describe('ReceivepoememailsComponent', () => {
  let component: ReceivepoememailsComponent;
  let fixture: ComponentFixture<ReceivepoememailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivepoememailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivepoememailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
