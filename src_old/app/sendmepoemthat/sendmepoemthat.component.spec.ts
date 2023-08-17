import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendmepoemthatComponent } from './sendmepoemthat.component';

describe('SendmepoemthatComponent', () => {
  let component: SendmepoemthatComponent;
  let fixture: ComponentFixture<SendmepoemthatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendmepoemthatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendmepoemthatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
