import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecievepoembybothComponent } from './recievepoembyboth.component';

describe('RecievepoembybothComponent', () => {
  let component: RecievepoembybothComponent;
  let fixture: ComponentFixture<RecievepoembybothComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecievepoembybothComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecievepoembybothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
