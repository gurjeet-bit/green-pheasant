import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchmeapoemComponent } from './searchmeapoem.component';

describe('SearchmeapoemComponent', () => {
  let component: SearchmeapoemComponent;
  let fixture: ComponentFixture<SearchmeapoemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchmeapoemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchmeapoemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
