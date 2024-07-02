import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeBookComponent } from './life-book.component';

describe('LifeBookComponent', () => {
  let component: LifeBookComponent;
  let fixture: ComponentFixture<LifeBookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LifeBookComponent]
    });
    fixture = TestBed.createComponent(LifeBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
