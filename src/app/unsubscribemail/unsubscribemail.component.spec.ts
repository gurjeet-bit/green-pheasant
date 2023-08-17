import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribemailComponent } from './unsubscribemail.component';

describe('UnsubscribemailComponent', () => {
  let component: UnsubscribemailComponent;
  let fixture: ComponentFixture<UnsubscribemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsubscribemailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsubscribemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
