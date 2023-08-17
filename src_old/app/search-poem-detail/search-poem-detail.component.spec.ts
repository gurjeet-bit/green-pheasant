import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPoemDetailComponent } from './search-poem-detail.component';

describe('SearchPoemDetailComponent', () => {
  let component: SearchPoemDetailComponent;
  let fixture: ComponentFixture<SearchPoemDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchPoemDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPoemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
