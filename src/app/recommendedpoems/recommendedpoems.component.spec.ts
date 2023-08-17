import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedpoemsComponent } from './recommendedpoems.component';

describe('RecommendedpoemsComponent', () => {
  let component: RecommendedpoemsComponent;
  let fixture: ComponentFixture<RecommendedpoemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendedpoemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedpoemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
