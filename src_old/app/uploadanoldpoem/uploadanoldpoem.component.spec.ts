import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadanoldpoemComponent } from './uploadanoldpoem.component';

describe('UploadanoldpoemComponent', () => {
  let component: UploadanoldpoemComponent;
  let fixture: ComponentFixture<UploadanoldpoemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadanoldpoemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadanoldpoemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
